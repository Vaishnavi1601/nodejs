const fs = require("fs");   //working with filesystem

const requestHandler = (req, res) => {
  const url = req.url;   
  const method = req.method; 
  // console.log(url);
  // console.log(method);

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>First page</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="title"><button type="submit">send</button></input></form></body>'
    );
    res.write("</html>");
    return res.end();
  }
  
  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {  //event listener ... on allows us to listen to certain event, function to be executed on every incoming data
      console.log(chunk);
      body.push(chunk);
    });
    
    //request is read by node in multiple parts  and we work on individual chunk

    req.on("end", () => {     // exccuted once the data parsing is done
      const parsedBody = Buffer.concat(body).toString(); //buffer allows us to hold multiple chunks and work with them
     // console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFileSync("message.txt", message);
    });

    // fs.writeFileSync("message.txt", "Dummy");
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }

  res.setHeader("Content-text", "text/html");
  res.write("<html>");
  res.write("<head><title>First page</title></head>");
  res.write("<body>Hello</body>");
  res.write("</html>"); //write allows us to write some data in response which will be in multiple lines or chunks
};

module.exports = requestHandler;
