//connecting to mdb
//importing mdb
const mongodb = require("mongodb"); // this give us access to mongodb apackage

//extracting mongoclient 
const MongoClient = mongodb.MongoClient;

//we can use that client to connect to our mongodb database
//wrapping connection code into method to connect to db

//_ is just to indicate that it we used internally in this file
let _db 

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb+srv://vaishnavi123:vaishnavi123@cluster0.7veks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then((client) => {
      //client gives us acces to db
      console.log("Connected");
      _db = client.db(); //storing connection to database in the db variable
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getdb = () =>{
  if(_db) {
    return _db;
  }
  throw 'No database found';
}


module.exports = mongoConnect; //exporting function
exports.getdb = getdb;