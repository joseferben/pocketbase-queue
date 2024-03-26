/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("v2i9s97ijtkb6as");

    collection.indexes = [
      "CREATE UNIQUE INDEX `idx_SKtU4DZ` ON `queue_locks` (`task`)",
      "CREATE INDEX `idx_GpAPmOu` ON `queue_locks` (`created`)",
    ];

    return dao.saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("v2i9s97ijtkb6as");

    collection.indexes = ["CREATE UNIQUE INDEX `idx_SKtU4DZ` ON `queue_locks` (`task`)"];

    return dao.saveCollection(collection);
  }
);
