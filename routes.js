const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

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
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    req.on("end", () => {
      const parseBody = Buffer.concat(body).toString();
      const message = parseBody.split("=")[1];
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
