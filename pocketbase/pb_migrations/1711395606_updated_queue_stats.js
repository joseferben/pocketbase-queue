/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  id,\n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n  (COUNT(id) / CAST(60 AS REAL)) as tasks_per_minute\nFROM queue_tasks\nWHERE created >= datetime('now', '-1 hour');",
    };

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

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "zxp7y3rc",
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
        id: "p6szbqrm",
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
        id: "mcnsbflo",
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
        id: "noitljah",
        name: "tasks_per_minute",
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
        "SELECT \n  id, \n  COUNT(id) as total_tasks, \n  SUM(CASE WHEN succeeded IS NOT '' THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN failed IS NOT '' THEN 1 ELSE 0 END) as failed_tasks,\n  (SELECT id FROM queue_tasks WHERE (succeeded IS NOT '' OR failed IS NOT '') ORDER BY created ASC LIMIT 1) as oldest_task_id,\n  (SELECT created FROM queue_tasks WHERE (succeeded IS NOT '' OR failed IS NOT '') ORDER BY created ASC LIMIT 1) as oldest_task_created\nFROM queue_tasks;",
    };

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

    // remove
    collection.schema.removeField("zxp7y3rc");

    // remove
    collection.schema.removeField("p6szbqrm");

    // remove
    collection.schema.removeField("mcnsbflo");

    // remove
    collection.schema.removeField("noitljah");

    return dao.saveCollection(collection);
  }
);
