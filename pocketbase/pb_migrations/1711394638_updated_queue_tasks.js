/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qgf0f8rtdk0s6pq");

    // update
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "h530uquw",
        name: "failed_reason",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: {
          min: null,
          max: null,
          pattern: "",
        },
      })
    );

    return dao.saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qgf0f8rtdk0s6pq");

    // update
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "h530uquw",
        name: "failed_message",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: {
          min: null,
          max: null,
          pattern: "",
        },
      })
    );

    return dao.saveCollection(collection);
  }
);
