const passport = require('passport');
const {Strategy} = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');

module.exports = function localStrategy(){
    passport.use(
        new Strategy(
            {
                usernameField: 'username',
                passwordField: 'password'
            },
            (username, password, done)=>{
                const url =
                "mongodb+srv://dbuser:dbuserpass1!@globomantics-clone.1anba.mongodb.net?retryWrites=true&w=majority";
              const dbName = "globomantics";
              //imediately invoked funtion
              (async function validateUSer(){
                  let client;
                  try {
                    client = await MongoClient.connect(url);

                    const db = client.db(dbName);

                    const user = await db.collection('users').findOne({username});

                    //checks if passwords match
                    if(user && user.password === password){
                        done(null, user);
                    }else{
                        //done("Oooops !! Username or Password was incorrect",false)
                        done(null, false);
                    }
                  } catch (error) {
                      done(error, false);
                  }
              }())

                // const user = { username, password, name: 'SlimGuy'};
                // done(null, user);
            }
        )
    );
};