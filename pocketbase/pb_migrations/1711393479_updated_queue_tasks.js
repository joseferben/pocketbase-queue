/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qgf0f8rtdk0s6pq");

    collection.indexes = [
      "CREATE INDEX `idx_jyHoldi` ON `queue_tasks` (\n  `queue`,\n  `succeeded`,\n  `failed`\n)",
      "CREATE INDEX `idx_TJTrLZe` ON `queue_tasks` (\n  `succeeded`,\n  `failed`,\n  `updated`\n)",
    ];

    return dao.saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qgf0f8rtdk0s6pq");

    collection.indexes = [
      "CREATE INDEX `idx_jyHoldi` ON `queue_tasks` (\n  `queue`,\n  `succeeded`,\n  `failed`\n)",
    ];

    return dao.saveCollection(collection);
  }
);
