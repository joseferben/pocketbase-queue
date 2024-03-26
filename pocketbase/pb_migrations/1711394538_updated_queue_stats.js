/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  id,\n  COUNT(id) as total_tasks, \n    SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks \nFROM queue_tasks;",
    };

    // remove
    collection.schema.removeField("gdqx4d5e");

    // remove
    collection.schema.removeField("lybyamo0");

    // remove
    collection.schema.removeField("u0yiagly");

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "fagwr5mn",
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
        id: "7xkhmdtq",
        name: "succeeded_tasks",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: {
          maxSize: 1,
        },
      })
    );

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "ykh3gaeg",
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
      query:
        "SELECT \n  id,\n  COUNT(id) as total_tasks, \n    SUM(CASE WHEN succeeded IS NOT NULL THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN failed IS NOT NULL THEN 1 ELSE 0 END) as failed_tasks \nFROM queue_tasks;",
    };

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "gdqx4d5e",
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
        id: "lybyamo0",
        name: "succeeded_tasks",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: {
          maxSize: 1,
        },
      })
    );

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "u0yiagly",
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

    // remove
    collection.schema.removeField("fagwr5mn");

    // remove
    collection.schema.removeField("7xkhmdtq");

    // remove
    collection.schema.removeField("ykh3gaeg");

    return dao.saveCollection(collection);
  }
);
