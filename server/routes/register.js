const express = require("express");
const Router = express.Router();

const registerController = require("../controllers/registerController");

Router.post("/", registerController.handleNewUser);

module.exports = Router;
