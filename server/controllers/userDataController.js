const Account = require("../model/account");
const Messages = require("../model/messages");
const Contacts = require("../model/contacts");
const User = require("../model/user");

const getAccountData = async (req, res) => {
  const id = req.body.user_id;

  try {
    const accountData = await Account.findOne({
      user_id: id,
    }).exec();

    res.status(200).json({
      username: accountData.username,
      age: accountData.age,
      image: accountData.image,
      mobile: accountData.mobile,
      user_id: accountData.user_id,
    });
  } catch (err) {
    console.log("Account data didnt fetch due to ", err);
  }
};

const getAllAccounts = async (req, res) => {
  const data = await Account.find();

  res.json(data);
};

const getAllContacts = async (req, res) => {
  const id = req.body.id;
  // console.log("contact", id);

  const acc = await Account.findOne({ user_id: id }).exec();
  const contactId = acc?.contact_id;
  const contacts = await Contacts.findOne({ _id: contactId }).exec();
  console.log("Db", contacts);
  const sortedContacts = contacts?.contacts.sort(
    (a, b) => Number(b.lastInteracted) - Number(a.lastInteracted)
  );
  console.log(sortedContacts);
  res.json(sortedContacts);
};

const newContact = async (req, res) => {
  try {
    const { senderId, email } = req.body;

    const receiverUser = await User.findOne({ email: email }).exec();
    if (!receiverUser || receiverUser.length === 0)
      return res.json({ msg: "Email doesnt exist" });
    const receiverId = receiverUser._id;

    const senderAcc = await Account.findOne({ user_id: senderId }).exec();

    const senderContacts = await Contacts.findOne({
      _id: senderAcc.contact_id,
    }).exec();

    const duplicateContact = senderContacts.contacts.filter(
      (a) => a.receiverId === receiverId
    );

    if (duplicateContact.length > 0) {
      res.json({ msg: "contact already present" });
    } else {
      res.json({ receiverId: receiverId });
    }
  } catch (err) {
    console.log(err);
  }
};

const getMsgs = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const senderAcc = await Account.findOne({
      user_id: senderId,
    }).exec();

    const receverAcc = await Account.findOne({
      user_id: receiverId,
    });

    const sender_contact_id = senderAcc.contact_id;
    const receiver_contact_id = receverAcc.contact_id;

    const sender_contact_db = await Contacts.findOne({
      _id: sender_contact_id,
    }).exec();
    const receiver_contact_db = await Contacts.findOne({
      _id: receiver_contact_id,
    }).exec();
    const cont = sender_contact_db.contacts.filter(
      (a) => a.receiverId === receiverId
    );
    console.log("------", cont);
    const msgId = cont[0]?.msgId;
    // console.log("msgid", msgId);
    if (!msgId) {
      //create a msg obj and then add it to contacts
      const newMsg = await Messages.create({
        msgs: [],
      });
      // console.log(newMsg);
      const newSenderContact = {
        receiverId: receiverId,
        contactName: receverAcc.username,
        lastInteracted: Date.parse(),
        lastMessage: {
          senderId: "",
          text: "",
          receiverId: "",
        },
        msgId: newMsg._id,
        profile: receverAcc.image,
      };
      const newReceiverContact = {
        receiverId: senderId,
        contactName: senderAcc.username,
        lastInteracted: Date.parse(),
        lastMessage: {
          senderId: "",
          text: "",
          receiverId: "",
        },
        msgId: newMsg._id,
        profile: senderAcc.image,
      };
      // console.log(newContact);
      // console.log("b4", sender_contact_db);
      if (senderId === receiverId) {
        sender_contact_db.contacts.push(newSenderContact);
        await sender_contact_db.save();
      } else {
        sender_contact_db.contacts.push(newSenderContact);
        receiver_contact_db.contacts.push(newReceiverContact);
        await sender_contact_db.save();
        await receiver_contact_db.save();
      }

      // console.log(result);
      res.json(newMsg.msgs);
    } else {
      const messages = await Messages.findOne({ _id: msgId }).exec();
      // console.log(messages);
      res.json(messages.msgs);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAccountData,
  getAllAccounts,
  getMsgs,
  getAllContacts,
  newContact,
};
