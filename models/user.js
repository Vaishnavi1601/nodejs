const mongodb = require("mongodb"); 

const getDb = require('../util/database').getDb;  //importing mongo db client

const ObjectID = mongodb.ObjectId;

//creating user
class User{
    constructor(username,email){
        this.name = username;
        this.email = email;
    }

    //saving user to db
    save () {
        const db = getDb(); //storing db client in db cosntant
        //on that client we can create a collection
        return db.collection('users').insertOne(this);          
        
    }

    //finding user by userId
    static findById(userId){

        const db = getDb();
        return db
        .collection('users')
        // .find({_id: new mongodb.ObjectId(userId)})
        //.next()
        .findOne({_id: new mongodb.ObjectId(userId)})
        
         }
}

module.exports = User;