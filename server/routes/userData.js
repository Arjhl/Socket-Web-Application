const express = require("express");

const Router = express.Router();

const userDataController = require("../controllers/userDataController");

Router.post("/", userDataController.getAccountData);
Router.get("/", userDataController.getAllAccounts);
Router.post("/contacts", userDataController.getAllContacts);
Router.post("/msgs", userDataController.getMsgs);
Router.post("/newContact", userDataController.newContact);

module.exports = Router;
