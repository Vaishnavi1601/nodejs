//module -- set of function we want to include in our application)
//core/built-in modules(hhtphttps,os,fs,path,etc...) -- (can be used without any installation)
//require() -- function to import the module or takes path to another file
const http = require("http");

const routes = require('./routes');


// function rqlistner(req,res){
// }

// http.createServer(rqlistner); createserver-- method which returns server ,takes a request listener(function that will execute for every incoming request) as argument

// http.createServer(function(req,res){

// }) passing anonymous function to create server, executed whenever a request reaches server //event driven architecture (if requets comes, execute this function)

//req is an object containing information about the http request that raised the event in response to req, we use res to send back response.

const server = http.createServer(routes);
  // console.log(req.url,req.method,req.headers);
  // process.exit(); //stops our event loop
server.listen(3000); // it keeps on listening for request on server , specifies the port we want to listen to

