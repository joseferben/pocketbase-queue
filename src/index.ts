import type Pocketbase from "pocketbase";
import type { ClientResponseError } from "pocketbase";

/**
 * Connection to a Pocketbase instance.
 * @param pb - The Pocketbase instance.
 * @param verbose - Optional flag to enable verbose logging.
 */
export interface Connection {
  pb: Pocketbase;
  verbose?: boolean;
}

/**
 * ISO-8601 date string.
 */
type IsoDateString = string;

/**
 * Task that has been persisted on the queue.
 * @template T - The type of the task.
 * @param id - Unique identifier of the task.
 * @param queue - The name of the queue the task belongs to.
 * @param task - The actual task payload.
 * @param failed - The ISO date string when the task failed, if applicable.
 * @param failed_reason - The reason for the task's failure, if any.
 * @param created - The ISO date string when the task was created.
 * @param updated - The ISO date string when the task was last updated.
 */
interface PersistedTask<T> {
  id: string;
  queue: string;
  task: T;
  failed?: IsoDateString | null;
  failed_reason?: string;
  created: IsoDateString;
  updated: IsoDateString;
}

/**
 * Lock acquired for processing a task.
 * @param id - Unique identifier of the lock.
 * @param worker_id - Identifier of the worker that acquired the lock.
 * @param taskId - Identifier of the task associated with the lock.
 * @param created - The ISO date string when the lock was created.
 * @param updated - The ISO date string when the lock was last updated.
 */
interface Lock {
  id: string;
  worker_id: string;
  taskId: string;
  created: IsoDateString;
  updated: IsoDateString;
}

/**
 * Processing function for tasks.
 * @template T - The type of the task.
 * @param opts - Options for task processing including the task itself and the workerId.
 * @returns A promise resolving to void, or void.
 */
type Processor<T> = (opts: { task: T; workerId: string }) => Promise<void> | void;

/**
 * Statistics of the task processing.
 * @param tasksPerSecond - The number of tasks processed per second.
 */
export interface Stats {
  tasksPerSecond: number;
}

/**
 * Options for creating a connection to Pocketbase.
 * @param url - The URL to the Pocketbase instance. Defaults to 'http://127.0.0.1:8090' if not provided.
 * @param email - The email for authentication.
 * @param password - The password for authentication.
 * @param verbose - Optional flag for verbose logging.
 * @param lockTimeout - The timeout for locks in milliseconds.
 * @param failedTaskTtl - The time-to-live for failed tasks in milliseconds.
 * @param maintenanceInterval - The interval for maintenance tasks in milliseconds.
 */
export interface CreateConnectionOpts {
  pb: Pocketbase;
  verbose?: boolean;
  lockTimeout?: number;
  failedTaskTtl?: number;
  maintenanceInterval?: number;
}

/**
 * Options for creating a queue.
 */
export interface CreateQueueOpts<T> {
  name: string;
  connection: Connection;
}

export function createConnection(opts: CreateConnectionOpts): Connection {
  const {
    pb,
    verbose,
    lockTimeout: lockTimeout_,
    failedTaskTtl: faileTaskTtl_,
    maintenanceInterval: maintenanceInterval_,
  } = opts;

  pb.autoCancellation(false);

  const lockTimeout = lockTimeout_ ?? 1000 * 60 * 5;
  const taskTtl = faileTaskTtl_ ?? 1000 * 60 * 60 * 24 * 7;
  const maintenanceInterval = maintenanceInterval_ ?? 1000 * 60;

  async function cleanUpFailedTasks(pb: Pocketbase) {
    verbose && console.log("cleaning up failed tasks");
    let toDelete = await pb.collection<PersistedTask<object>>("queue_tasks").getList(1, 100, {
      filter: `(failed != null) && updated < "${new Date(Date.now() - taskTtl).toISOString()}"`,
    });
    while (toDelete.items.length) {
      verbose && console.log("deleting", toDelete.items.length, "tasks");
      for (const task of toDelete.items) {
        await pb.collection("queue_tasks").delete(task.id);
      }
      try {
        toDelete = await pb.collection<PersistedTask<object>>("queue_tasks").getList(1, 100, {
          filter: `(failed != null) && updated < "${new Date(Date.now() - taskTtl).toISOString()}"`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function releaseLocks(pb: Pocketbase) {
    verbose && console.log("releasing timed out locks");
    let toDelete = await pb.collection<Lock>("queue_locks").getList(1, 100, {
      filter: `created < "${new Date(Date.now() - lockTimeout).toISOString()}"`,
    });
    while (toDelete.items.length) {
      verbose && console.log("releasing", toDelete.items.length, "locks");
      for (const lock of toDelete.items) {
        try {
          await pb.collection("queue_locks").delete(lock.id);
        } catch (e) {
          // falls through
        }
      }
      try {
        toDelete = await pb.collection<Lock>("queue_locks").getList(1, 100, {
          filter: `created < "${new Date(Date.now() - lockTimeout).toISOString()}"`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  verbose && console.log("starting maintenance tasks");
  void cleanUpFailedTasks(pb);
  setInterval(() => cleanUpFailedTasks(pb), maintenanceInterval);
  void releaseLocks(pb);
  setInterval(() => releaseLocks(pb), maintenanceInterval);

  return { pb, verbose };
}

export function createQueue<T extends object | undefined>(opts: CreateQueueOpts<T>) {
  const {
    name,
    connection: { pb, verbose },
  } = opts;
  const errorListeners: ((error: Error) => void)[] = [];
  const statsListeners: ((stats: Stats) => void)[] = [];
  let taskCount = 0;
  let statsInterval: NodeJS.Timer | null = null;
  let running = false;

  async function push(opts: { task: T }) {
    await pb.collection("queue_tasks").create({
      queue: name,
      task: opts.task,
    });
  }

  async function getNextLockableTask() {
    const result = await pb.collection<PersistedTask<T>>("queue_tasks").getList(1, 1, {
      filter: `queue = "${name}" && failed = null && queue_locks_via_task.id = null`,
      sort: "created",
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

  async function tryAcquireLock(opts: { workerId: string; task: PersistedTask<T> }) {
    const { workerId, task } = opts;
    try {
      return await pb.collection<Lock>("queue_locks").create({
        worker_id: workerId,
        task: task.id,
      });
    } catch (e) {
      if (
        (e as ClientResponseError).originalError?.data.data.task.code ===
        // failed to acquire lock
        "validation_not_unique"
      ) {
        return null;
      }
      console.error(e);
    }
  }

  function close() {
    console.log("shutting down workers...");
    running = false;
    if (statsInterval) {
      clearInterval(statsInterval);
    }
  }

  async function loopProcessing(workerId: string, fn: Processor<T>) {
    while (running) {
      try {
        verbose && console.log(workerId, "getting next lockable task");
        const nextLockableTask = await getNextLockableTask();
        if (!nextLockableTask) {
          verbose && console.log(workerId, "no tasks to process, waiting 1s");
          await sleep(1000);
          continue;
        }
        verbose && console.log(workerId, "trying to lock task", nextLockableTask.id);
        let acquiredLock = await tryAcquireLock({
          workerId,
          task: nextLockableTask,
        });
        if (!acquiredLock) {
          verbose && console.log(workerId, "failed to acquire lock, trying to lock next task");
          continue;
        }
        verbose && console.log(workerId, "acquired lock for task", nextLockableTask.id);
        taskCount++;
        try {
          verbose && console.log(workerId, "processing task", nextLockableTask.id);
          await fn({ task: nextLockableTask.task, workerId });
        } catch (e) {
          await pb.collection("queue_tasks").update(nextLockableTask.id, {
            failed: new Date().toISOString(),
            failed_reason: (e as Error).message,
          });
          try {
            await pb.collection("queue_locks").delete(acquiredLock.id);
          } catch (e) {
            // falls through
          }
          continue;
        }
        // task succeeded
        await pb.collection("queue_tasks").delete(nextLockableTask.id);
        try {
          await pb.collection("queue_locks").delete(acquiredLock.id);
        } catch (e) {
          // falls through
        }
        verbose && console.log(workerId, "task processed", nextLockableTask.id);
      } catch (e) {
        errorListeners.forEach((listener) => listener(e as Error));
        console.error("worker failed", workerId, e);
        sleep(1000);
      }
    }
  }

  async function process(opts: { concurrency: number }, fn: Processor<T>) {
    const { concurrency } = opts;
    verbose && console.log(`starting ${concurrency} workers for ${name}`);
    running = true;
    for (let i = 0; i < concurrency; i++) {
      const workerId = Math.random().toString(36).substring(7);
      verbose && console.log("starting worker", workerId);
      loopProcessing(`${workerId}-${i}`, fn);
      await sleep(Math.random() * 10);
    }

    if (!statsInterval) {
      statsInterval = setInterval(() => {
        statsListeners.forEach((listener) => listener({ tasksPerSecond: taskCount }));
        taskCount = 0;
      }, 1000);
    }
  }

  function on(event: "stats", listener: (stats: Stats) => void): void;
  function on(event: "error", listener: (error: Error) => void): void;
  function on(
    event: "stats" | "error",
    listener: ((stats: Stats) => void) | ((error: Error) => void)
  ) {
    if (event === "error") {
      errorListeners.push(listener as (error: Error) => void);
    } else if (event === "stats") {
      statsListeners.push(listener as (stats: Stats) => void);
    }
  }

  return { push, process, close, on };
}
