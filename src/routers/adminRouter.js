const express = require("express");
const { MongoClient } = require("mongodb");
const debug = require('debug')('app:adminRouter');
const sessions = require("../data/sessions.json");

const adminRouter = express.Router();

adminRouter.route("/").get((req, res) => {
  const url =
    "mongodb+srv://dbuser:dbuserpass1!@globomantics-clone.1anba.mongodb.net?retryWrites=true&w=majority";
  const dbName = "globomantics";

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug("connected");

      const db = client.db(dbName);

      const response = await db.collection("sessions").insertMany(sessions);

      res.json(response);

    } catch (error) {
      debug(error.stack);
    }
  })();
});

module.exports = adminRouter;
