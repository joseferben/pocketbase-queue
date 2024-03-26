# pocketbase-queue

A type-safe queue for background tasks on top of PocketBase. Works in all JavaScript environments that implement `fetch`.

This is **not** a high-throughput queue, but it's a good solution to keep things simple. It works with a vanilla PocketBase installation, no changes or additional hooks needed.

## Installation

```bash
npm i pocketbase-queue
```

Import the queue collections to your PocketBase instance. Don't forget to tick `Merge with the existing collections`:

```json
[
  {
    "id": "v2i9s97ijtkb6as",
    "name": "queue_locks",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "gb9nqipq",
        "name": "worker_id",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "of2tn7ct",
        "name": "task",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "qgf0f8rtdk0s6pq",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_SKtU4DZ` ON `queue_locks` (`task`)",
      "CREATE INDEX `idx_GpAPmOu` ON `queue_locks` (`created`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  },
  {
    "id": "qgf0f8rtdk0s6pq",
    "name": "queue_tasks",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "kdzlqnxa",
        "name": "queue",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "odvdwps6",
        "name": "task",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "lfsvih6z",
        "name": "failed",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "h530uquw",
        "name": "failed_reason",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_jyHoldi` ON `queue_tasks` (\n  `queue`,\n  `failed`,\n  `created`\n)",
      "CREATE INDEX `idx_TJTrLZe` ON `queue_tasks` (\n  `failed`,\n  `updated`\n)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  },
  {
    "id": "ronp4q37zviiby1",
    "name": "queue_stats",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "an0kocfc",
        "name": "pending_tasks",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "nnwglxhx",
        "name": "failed_tasks",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT \n  queue as id,\n  SUM(CASE WHEN failed IS '' THEN 1 ELSE 0 END) as pending_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks\nFROM queue_tasks\nGROUP BY queue;"
    }
  }
]
```

## Usage

```typescript
import { createConnection, createQueue } from "pocketbase-queue";

// Create a service admin user and use its credentials to create a connection:
const connection = await createConnection({
  url: process.env.POCKETBASE_URL, // Your PocketBase URL
  email: process.env.POCKETBASE_EMAIL, // The email of a PocketBase admin
  password: process.env.POCKETBASE_PASSWORD, // The password of the PocketBase admin
  verbose: true,
});

const queue = createQueue<{ message: string }>({
  name: "greeting",
  connection,
});

queue.push({ message: "Hello, world!" });

queue.process({ concurrency: 2 }, async ({ task }) => {
  console.log(task.message);
});
```

## Advanced usage

```typescript
queue.on("error", (error) => {
  // Prints pocketbase-queue errors, actual task errors are handled by the task processor
  console.error(error);
});

queue.on("stats", (stats) => {
  // Prints basic queue stats, like tasks per second
  console.log(stats);
});

// On Node, use this to gracefully exit workers. This makes sure there are no unreleased locks.
// Unreleased locks get cleaned up after 5 minutes, but it's better to release them as soon as possible.
process.on("SIGINT", async () => {
  queue.close();
  await new Promise((resolve) => setImmediate(resolve));
  console.log("exiting");
  process.exit(0);
});
```

## Run tests

Install and start PocketBase:

```bash
./pocketbase/pocketbase serve --dev
```

Run the tests:

```bash
POCKETBASE_EMAIL=<admin email> POCKETBASE_PASSWORD=<admin password> npm run dev
```

## Considerations

- I easily reached 50-60 tasks per second with 4 concurrent workers and a local PocketBase instance
- Make sure to run the workers as close as possible to the PocketBase instance to reduce latency
- Failed tasks are stored with the error message for 7 days, use `failedTaskTtl` to configure this setting in milliseconds
