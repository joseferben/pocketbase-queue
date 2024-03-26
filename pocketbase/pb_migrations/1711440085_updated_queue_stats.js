/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  id,\n  SUM(CASE WHEN failed IS '' AND succeeded IS '' THEN 1 ELSE 0 END) as pending_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks\nFROM queue_tasks",
    };

    // remove
    collection.schema.removeField("nwx2arew");

    // remove
    collection.schema.removeField("srzsohbk");

    // remove
    collection.schema.removeField("iyekgxxr");

    // remove
    collection.schema.removeField("jn95ntue");

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "h8qididp",
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
        id: "e64xgxzj",
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
        id: "yeiftkb5",
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
        id: "bxjo4xbc",
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

    return dao.saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  id,\n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n    SUM(CASE WHEN failed IS '' AND succeeded IS '' THEN 1 ELSE 0 END) as pending_tasks\nFROM queue_tasks",
    };

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "nwx2arew",
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
        id: "srzsohbk",
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
        id: "iyekgxxr",
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
        id: "jn95ntue",
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

    // remove
    collection.schema.removeField("h8qididp");

    // remove
    collection.schema.removeField("e64xgxzj");

    // remove
    collection.schema.removeField("yeiftkb5");

    // remove
    collection.schema.removeField("bxjo4xbc");

    return dao.saveCollection(collection);
  }
);
