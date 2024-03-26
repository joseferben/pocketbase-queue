/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const collection = new Collection({
      id: "ronp4q37zviiby1",
      created: "2024-03-25 19:18:12.880Z",
      updated: "2024-03-25 19:18:12.880Z",
      name: "queue_stats",
      type: "view",
      system: false,
      schema: [
        {
          system: false,
          id: "l2zt8qtm",
          name: "total_tasks",
          type: "number",
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            noDecimal: false,
          },
        },
      ],
      indexes: [],
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {
        query: "SELECT id, COUNT(id) as total_tasks FROM queue_tasks;",
      },
    });

    return Dao(db).saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    return dao.deleteCollection(collection);
  }
);
