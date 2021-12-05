//import express from "express";

const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const debug = require("debug")("app:sessionsRouter");
const sessionsRouter = express.Router();
//calling the service
const speakerService = require("../services/speakerService");

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const sessions = require("../data/sessions.json");

// import data from '../data/sessions.json';
// import { readFile } from "fs/promises";
// const sessions = JSON.parse(await readFile(data));

//controls sessions acccessibilty by checking whether user has been signed in
sessionsRouter.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/auth/signin");
  }
});

sessionsRouter.route("/").get((req, res) => {
  const url =
    "mongodb+srv://dbuser:dbuserpass1!@globomantics-clone.1anba.mongodb.net?retryWrites=true&w=majority";
  const dbName = "globomantics";

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug("connected");

      const db = client.db(dbName);

      const sessions = await db.collection("sessions").find().toArray();

      res.render("sessions", { sessions });
    } catch (error) {
      debug(error.stack);
    }
  })();
  //res.render("sessions", { sessions });
});

sessionsRouter.route("/:id").get((req, res) => {
  const id = req.params.id;
  const url =
    "mongodb+srv://dbuser:dbuserpass1!@globomantics-clone.1anba.mongodb.net?retryWrites=true&w=majority";
  const dbName = "globomantics";

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug("connected");

      const db = client.db(dbName);
      const session = await db
        .collection("sessions")
        .findOne({ _id: new ObjectID(id) });
      //Calling the service
      const speaker = await speakerService.getSpeakerById(
        session.speakers[0].id
      );
      session.speaker = speaker.data;

      res.render("session", {
        session,
      });
    } catch (error) {
      debug(error.stack);
    }
  })();
  //   res.render("session", {
  //     session: sessions[id],
  //   });
});

module.exports = sessionsRouter;
