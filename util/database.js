const mysql = require("mysql2"); 

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_complete',
    password: 'vaishnavi123'

});

module.exports = pool.promise();     //this will allow us to handle promises