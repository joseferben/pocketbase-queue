/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("ronp4q37zviiby1");

    collection.options = {
      query:
        "SELECT \n  id,\n  COUNT(id) as total_tasks, \n    SUM(CASE WHEN succeeded = TRUE THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN failed = TRUE THEN 1 ELSE 0 END) as failed_tasks \nFROM queue_tasks;",
    };

    // remove
    collection.schema.removeField("lwu5mxli");

    // remove
    collection.schema.removeField("ojh7atua");

    // remove
    collection.schema.removeField("tixavklz");

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "fypfspkr",
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
        id: "xj7yvbbx",
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
        id: "2qzjtz0d",
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
        "SELECT \n  id,\n  COUNT(id) as total_tasks, \n    SUM(CASE WHEN failed = TRUE THEN 1 ELSE 0 END) as succeeded_tasks,\n  SUM(CASE WHEN failed = TRUE THEN 1 ELSE 0 END) as failed_tasks \nFROM queue_tasks;",
    };

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: "lwu5mxli",
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
        id: "ojh7atua",
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
        id: "tixavklz",
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
    collection.schema.removeField("fypfspkr");

    // remove
    collection.schema.removeField("xj7yvbbx");

    // remove
    collection.schema.removeField("2qzjtz0d");

    return dao.saveCollection(collection);
  }
);
