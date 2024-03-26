/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  queue as id,\n  SUM(CASE WHEN failed IS '' AND succeeded IS '' THEN 1 ELSE 0 END) as pending_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks\nFROM queue_tasks\nGROUP BY queue;",
    };

    // remove
    collection.schema.removeField("n2cj1oat");

    // remove
    collection.schema.removeField("umxgodyd");

    // remove
    collection.schema.removeField("dzz8aqq3");

    // remove
    collection.schema.removeField("51jbmqeb");

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "lh3qcdpn",
        name: "pending_tasks",
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
        id: "ddojfbfc",
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
        "SELECT \n  queue as id,\n  SUM(CASE WHEN failed IS '' AND succeeded IS '' THEN 1 ELSE 0 END) as pending_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks\nFROM queue_tasks\nGROUP BY queue;",
    };

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "n2cj1oat",
        name: "pending_tasks",
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
        id: "umxgodyd",
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

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "dzz8aqq3",
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
        id: "51jbmqeb",
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

    // remove
    collection.schema.removeField("lh3qcdpn");

    // remove
    collection.schema.removeField("ddojfbfc");

    return dao.saveCollection(collection);
  }
);
