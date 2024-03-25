import { createConnection, createQueue } from "~/index";

export async function start() {
  if (!process.env.POCKETBASE_EMAIL) {
    throw new Error("POCKETBASE_EMAIL is required");
  }
  if (!process.env.POCKETBASE_PASSWORD) {
    throw new Error("POCKETBASE_PASSWORD is required");
  }

  const connection = await createConnection({
    url: process.env.POCKETBASE_URL,
    email: process.env.POCKETBASE_EMAIL,
    password: process.env.POCKETBASE_PASSWORD,
  });

  const queue = createQueue<{ message: string }>({
    name: "greeting",
    connection,
  });

  void queue.startProcessing((task) => {
    console.log(task);
  });

  // simulate adding tasks to queue
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const randomTimeout = Math.floor(Math.random() * 200);
    await new Promise((resolve) => setTimeout(resolve, randomTimeout));
    queue.push({ task: { message: "current time is " + Date.now() } });
  }
}

start();
