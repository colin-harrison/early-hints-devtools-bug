const http2 = require("http2");
const fs = require("fs");

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

const server = http2.createSecureServer(options, (req, res) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === "GET" && req.url === "/earlyhints") {
    res.writeEarlyHints({
      link: "</index.css>; rel=preload; as=style",
    });
    setTimeout(() => {
      res.end(
        `<head><link rel="stylesheet" href="/index.css"></head><body>Early Hints Page!</body>`
      );
    }, 5000);
  } else if (req.method === "GET" && req.url === "/index.css") {
    res.setHeader("Content-Type", "text/css");
    res.end("body { color: red; }");
  } else {
    res.statusCode = 404;
    res.end("Not found.");
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
