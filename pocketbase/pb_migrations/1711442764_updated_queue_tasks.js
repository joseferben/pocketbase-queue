/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qgf0f8rtdk0s6pq");

    // remove
    collection.schema.removeField("ajkknsbb");

    return dao.saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("qgf0f8rtdk0s6pq");

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "ajkknsbb",
        name: "succeeded",
        type: "date",
        required: false,
        presentable: false,
        unique: false,
        options: {
          min: "",
          max: "",
        },
      })
    );

    return dao.saveCollection(collection);
  }
);
