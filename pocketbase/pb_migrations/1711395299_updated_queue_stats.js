/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  id, \n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n  (SELECT id FROM queue_tasks WHERE (succeeded IS NOT '' OR failed IS NOT '') ORDER BY created ASC LIMIT 1) as oldest_task_id,\n  (SELECT created FROM queue_tasks WHERE (succeeded IS NOT '' OR failed IS NOT '') ORDER BY created ASC LIMIT 1) as oldest_task_created\nFROM queue_tasks;",
    };

    // remove
    collection.schema.removeField("9591b8tp");

    // remove
    collection.schema.removeField("yqslvqmw");

    // remove
    collection.schema.removeField("aj1fcowv");

    // remove
    collection.schema.removeField("evkky4gt");

    // remove
    collection.schema.removeField("x0dnwhkn");

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "cb0fm0bx",
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
        id: "sggssbup",
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
        id: "vd8olmtd",
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
        id: "kez6scov",
        name: "oldest_task_id",
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
        id: "ecpxyxax",
        name: "oldest_task_created",
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
        "SELECT \n  main.id,\n  COUNT(main.id) as total_tasks, \n  SUM(CASE WHEN main.succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN main.failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n  oldest_task.id as oldest_task_id,\n  oldest_task.created as oldest_task_created\nFROM queue_tasks main\nLEFT JOIN (\n  SELECT id, created\n  FROM queue_tasks\n  WHERE (succeeded IS NOT '' OR failed IS NOT '')\n  ORDER BY created ASC\n  LIMIT 1\n) as oldest_task ON main.id = oldest_task.id\nGROUP BY main.id;",
    };

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "9591b8tp",
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
        id: "yqslvqmw",
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
        id: "aj1fcowv",
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
        id: "evkky4gt",
        name: "oldest_task_id",
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
        id: "x0dnwhkn",
        name: "oldest_task_created",
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
    collection.schema.removeField("cb0fm0bx");

    // remove
    collection.schema.removeField("sggssbup");

    // remove
    collection.schema.removeField("vd8olmtd");

    // remove
    collection.schema.removeField("kez6scov");

    // remove
    collection.schema.removeField("ecpxyxax");

    return dao.saveCollection(collection);
  }
);
