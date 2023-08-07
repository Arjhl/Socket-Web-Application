require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const credentials = require("./config/credentials");
const { corsOptionsDelegate } = require("./config/corsOptions");
const logger = require("./middleware/logger");
const app = express();
const connect = require("./config/dbConfig");
const mongoose = require("mongoose");

const httpServer = createServer(app);

app.use(credentials);
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
connect();
app.use(express.static(__dirname));
app.use("/", (req, res, next) => {
  next();
});

const io = new Server(httpServer, {
  cors: "*",
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("msg", (arg1) => {
    console.log(arg1);
  });

  socket.on("input", (srg) => {
    console.log(srg);
  });

  socket.emit("hello", "How u");
});

// app.use("/", (req, res, next) => {
//   res.send("<h1>Server</h1>");
// });

app.use("/register", require("./routes/register"));
app.use("/userdetails", require("./routes/userdetails"));
app.use("/auth", require("./routes/auth"));

mongoose.connection.once("open", () => {
  console.log("DB CONNECTED");
  httpServer.listen(8080, () => {
    console.log("server running");
  });
});
