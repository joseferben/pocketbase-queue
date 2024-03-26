/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const collection = new Collection({
      id: "qxou85mhs1zcsau",
      created: "2024-03-26 08:04:17.018Z",
      updated: "2024-03-26 08:04:17.018Z",
      name: "queue_workers",
      type: "base",
      system: false,
      schema: [
        {
          system: false,
          id: "jspoljxl",
          name: "queue",
          type: "text",
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "oeat8gu8",
          name: "pinged",
          type: "date",
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: "",
            max: "",
          },
        },
      ],
      indexes: ["CREATE INDEX `idx_mLvVO8g` ON `queue_workers` (`pinged`)"],
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    });

    return Dao(db).saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qxou85mhs1zcsau");

    return dao.deleteCollection(collection);
  }
);
