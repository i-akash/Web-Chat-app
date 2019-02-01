var express = require("express");
var http = require("http");
var io = require("socket.io");
var connectionHandle = require("./SocketHandle");
var router = require("./ApiRequest");

const app = express();
const server = http.createServer(app);
const ioc = io(server);

app.use(express.json());
app.use("/api", router);

ioc.on("connect", connectionHandle);

// setInterval(() => {
//   ioc.of("/").clients((err, cl) => console.log(cl));
// }, 5000);

server.listen(8080, () => console.log("localhost:8080"));
