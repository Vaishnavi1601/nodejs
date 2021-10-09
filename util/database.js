//connecting to mdb
//importing mdb
const mongodb = require("mongodb"); // this give us access to mongodb apackage

//extracting mongoclient 
const MongoClient = mongodb.MongoClient;

//we can use that client to connect to our mongodb database
//wrapping connection code into method to connect to db

//_ is just to indicate that it we used internally in this file
let _db ;  //intially undefines

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb+srv://vaishnavi123:vaishnavi123@cluster0.7veks.mongodb.net/shop?retryWrites=true&w=majority")
    .then((client) => {
      //client gives us acces to db
      console.log("Connected");
      
      //storing connection to database in the db variable(accessing databse)
      _db = client.db(); //by default we will be connected to  myFirstDatbase, here we are yelling mongodb connect me to this particular database


      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

//form to server -- req.body  


//getDb method -- returns access to connected database if it exists
const getDb = () =>{
  //checking if db is set 
  if(_db) {
    //if true then return access to database
    return _db;
  }
  throw 'No database found';
}


exports.mongoConnect = mongoConnect; //exporting function for connecting to the database
exports.getDb = getDb;// for storing the connection to the database