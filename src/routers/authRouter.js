const express = require("express");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:adminRouter");
const passport = require("passport");

const authRouter = express.Router();

authRouter.route("/signup").post((req, res) => {
  //res.json(req.body);

  //create user
  const { username, password } = req.body;
  const url =
    "mongodb+srv://dbuser:dbuserpass1!@globomantics-clone.1anba.mongodb.net?retryWrites=true&w=majority";
  const dbName = "globomantics";

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = { username, password };
      const results = await db.collection("users").insertOne(user);
      //debug(results);
      req.login(results, () => {
        res.redirect("/auth/profile");
      });
    } catch (error) {
      debug(error);
    }
  })();

  //    req.login(req.body, ()=>{
  //        res.redirect('/auth/profile');
  //    })
});

authRouter
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post(
    passport.authenticate("local", {
      successRedirect: "/auth/profile",
      failureMessage: "/",
    })
  );
  
authRouter.route("/profile").get((req, res) => {
  res.json(req.user);
});

module.exports = authRouter;
