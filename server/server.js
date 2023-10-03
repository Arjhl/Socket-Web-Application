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
const User = require("./model/user");
const Account = require("./model/account");
const Messages = require("./model/messages");
const Contacts = require("./model/contacts");

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
const connectedUsers = {};

io.on("connection", (socket) => {
  // console.log("socketId", socket.id);

  socket.on("register", function (id) {
    socket.user_id = id;
    connectedUsers[id] = socket;
    console.log(connectedUsers);
  });

  socket.on("private_msg", async function (s) {
    const to = s.receiverId,
      message = s.text;
    const from = s.senderId;

    if (from !== to) {
      if (connectedUsers.hasOwnProperty(from)) {
        connectedUsers[from].emit("private_msg", {
          senderId: s.senderId,
          receiverId: s.receiverId,
          text: s.text,
        });
      }
    }

    if (connectedUsers.hasOwnProperty(to)) {
      connectedUsers[to].emit("private_msg", {
        //The sender's user_id
        senderId: s.senderId,
        receiverId: s.receiverId,
        text: s.text,
      });
    }
    // io.emit("msg", s.text);
    // io.to(senderSocketId).emit("private-msg", s);
    // io.to(receiverSocketId).emit("private-msg", s);
    // console.log(s);
    //add msg to db
    const senderAcc = await Account.findOne({ user_id: s.senderId });
    const receiverAcc = await Account.findOne({ user_id: s.receiverId });
    const senderContactData = await Contacts.findOne({
      _id: senderAcc.contact_id,
    }).exec();
    const receiverContactData = await Contacts.findOne({
      _id: receiverAcc.contact_id,
    }).exec();

    const senderContact = senderContactData.contacts.filter((m) => {
      return m.receiverId === s.receiverId;
    })[0];
    const receiverContact = receiverContactData.contacts.filter((m) => {
      return m.receiverId === s.senderId;
    })[0];
    // const time = String(Date.now());
    // console.log(senderContact, receiverContact);
    const newSenderContact = senderContact;
    const newReceiverContact = receiverContact;
    newSenderContact.lastInteracted = newReceiverContact.lastInteracted =
      String(Date.now());
    newSenderContact.lastMessage = newReceiverContact.lastMessage = s;
    const senderContactFiltered = senderContactData.contacts.filter(
      (m) => m.receiverId !== s.receiverId
    );
    const receiverContactFiltered = receiverContactData.contacts.filter(
      (m) => m.receiverId !== s.senderId
    );
    await Contacts.updateOne(
      { _id: senderAcc.contact_id },
      { contacts: [...senderContactFiltered, newSenderContact] }
    );
    await Contacts.updateOne(
      { _id: receiverAcc.contact_id },
      { contacts: [...receiverContactFiltered, newReceiverContact] }
    );

    // console.log("cont", senderContacts);
    try {
      const messages = await Messages.findOne({
        _id: senderContact.msgId,
      });

      // console.log(messages);
      await messages.msgs.push(s);
      messages.save();
      io.emit("renderContacts", "idk");
    } catch (err) {
      console.log("the message didnt updated in db because ", err);
    }
  });
});

app.use("/register", require("./routes/register"));
app.use("/userdetails", require("./routes/userdetails"));
app.use("/auth", require("./routes/auth"));
app.use("/userData", require("./routes/userData"));

mongoose.connection.once("open", () => {
  console.log("DB CONNECTED");
  httpServer.listen(8080, () => {
    console.log("server running");
  });
});
