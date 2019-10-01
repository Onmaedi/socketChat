const express = require("express");
const http = require("http");
const { config, engine } = require("express-edge");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.set("views", "./views");
app.use(express.static("public"));
app.use(engine);

var connections = 0;
var messages = [];

app.get("/", ({ req, res }) => {
  res.render("index", { title: "Titulo" });
});

io.on("connection", socket => {
  connections++;

  socket.emit("previous-messages", messages);

  socket.on("disconnect", () => {
    connections--;
    socket.emit("change-online", connections);
  });

  socket.on("sending-message", message => {
    socket.emit("change-online", connections);
    socket.broadcast.emit("recived-message", message);
    messages.push(message);
  });
});

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
