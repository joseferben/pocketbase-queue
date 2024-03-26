/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  id,\n  queue,\n  SUM(CASE WHEN failed IS '' AND succeeded IS '' THEN 1 ELSE 0 END) as pending_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks\nFROM queue_tasks\nGROUP BY queue;",
    };

    // remove
    collection.schema.removeField("h8qididp");

    // remove
    collection.schema.removeField("e64xgxzj");

    // remove
    collection.schema.removeField("yeiftkb5");

    // remove
    collection.schema.removeField("bxjo4xbc");

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "d1yiqhbe",
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
      })
    );

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "whjby5zu",
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
        id: "3hf3psvp",
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
        id: "ngwshv6m",
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
        id: "vaughe7p",
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
        "SELECT \n  id,\n  SUM(CASE WHEN failed IS '' AND succeeded IS '' THEN 1 ELSE 0 END) as pending_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks\nFROM queue_tasks",
    };

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

    // remove
    collection.schema.removeField("d1yiqhbe");

    // remove
    collection.schema.removeField("whjby5zu");

    // remove
    collection.schema.removeField("3hf3psvp");

    // remove
    collection.schema.removeField("ngwshv6m");

    // remove
    collection.schema.removeField("vaughe7p");

    return dao.saveCollection(collection);
  }
);
