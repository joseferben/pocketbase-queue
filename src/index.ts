import Pocketbase from "pocketbase";

export interface Connection {
  pb: Pocketbase;
}

type IsoDateString = string;

interface PersistedTask<T> {
  id: string;
  queue: string;
  task: T;
  succeeded?: IsoDateString | null;
  failed?: IsoDateString | null;
  created: IsoDateString;
  updated: IsoDateString;
}

interface Lock {
  id: string;
  workerId: string;
  taskId: string;
  created: IsoDateString;
  updated: IsoDateString;
}

export async function createConnection({
  url,
  email,
  password,
}: {
  url?: string;
  email: string;
  password: string;
}): Promise<Connection> {
  const pb = new Pocketbase(url || "http://127.0.0.1:8090");
  await pb.admins.authWithPassword(email, password);
  pb.autoCancellation(false);
  return { pb };
}

export function createQueue<T extends object | undefined>(opts: {
  name: string;
  connection: Connection;
}) {
  const {
    name,
    connection: { pb },
  } = opts;
  async function push(opts: { task: T }) {
    await pb.collection("queue_tasks").create({
      queue: name,
      task: opts.task,
    });
  }

  async function getNextLockableTask() {
    const result = await pb
      .collection<PersistedTask<T>>("queue_tasks")
      .getList(1, 1, {
        filter: `queue = "${name}" && succeeded = null && failed = null`,
      });
    if (!result.items.length) {
      return undefined;
    } else {
      return result.items[0];
    }
  }

  async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function tryAcquireLock(opts: {
    workerId: string;
    task: PersistedTask<T>;
  }) {
    const { workerId, task } = opts;
    try {
      return await pb.collection<Lock>("queue_locks").create({
        worker_id: workerId,
        task: task.id,
      });
    } catch (e) {
      // TODO make sure we don't swallow other errors
      return null;
    }
  }

  async function startProcessing(fn: (task: T) => Promise<void> | void) {
    const workerId = Math.random().toString(36).substring(7);
    console.log("starting worker", workerId);
    while (true) {
      const nextLockableTask = await getNextLockableTask();
      if (!nextLockableTask) {
        console.log("no tasks to process, waiting 500ms");
        await sleep(500);
        continue;
      }
      console.log("trying to lock task", nextLockableTask.id);
      let acquiredLock = await tryAcquireLock({
        workerId,
        task: nextLockableTask,
      });
      if (!acquiredLock) {
        console.log("failed to acquire lock, trying to lock next task");
        continue;
      }
      console.log("acquired lock for task", nextLockableTask.id);
      try {
        console.log("processing task", nextLockableTask.id);
        await fn(nextLockableTask.task);
        await pb
          .collection("queue_tasks")
          .update(nextLockableTask.id, { succeeded: new Date().toISOString() });
        await pb.collection("queue_locks").delete(acquiredLock.id);
        console.log("task processed", nextLockableTask.id);
      } catch (e) {
        console.error("failed to process task", nextLockableTask.id, e);
        await pb
          .collection("queue_tasks")
          .update(nextLockableTask.id, { failed: new Date().toISOString() });
        await pb.collection("queue_locks").delete(acquiredLock.id);
      }
    }
  }

  return { push, startProcessing };
}
