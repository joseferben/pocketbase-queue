/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qgf0f8rtdk0s6pq");

    // add
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
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qgf0f8rtdk0s6pq");

    // remove
    collection.schema.removeField("h530uquw");

    return dao.saveCollection(collection);
  }
);
