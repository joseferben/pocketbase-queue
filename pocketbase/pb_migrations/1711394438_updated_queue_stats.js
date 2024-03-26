/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  id,\n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN failed = TRUE THEN 1 ELSE 0 END) as failed_tasks \nFROM queue_tasks;",
    };

    // remove
    collection.schema.removeField("l2zt8qtm");

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "l19bjzfx",
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
      })
    );

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "sngjfhd0",
        name: "failed_tasks",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: {
          maxSize: 1,
        },
      })
    );

    return dao.saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query: "SELECT id, COUNT(id) as total_tasks FROM queue_tasks;",
    };

    // add
    collection.schema.addField(
      new SchemaField({
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
      })
    );

    // remove
    collection.schema.removeField("l19bjzfx");

    // remove
    collection.schema.removeField("sngjfhd0");

    return dao.saveCollection(collection);
  }
);
