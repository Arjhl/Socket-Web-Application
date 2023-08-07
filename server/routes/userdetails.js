const Router = require("express").Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
let Account = require("../model/account");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "images"));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

let upload = multer({ storage: storage });

Router.post("/", upload.single("image"), async (req, res) => {
  console.log(req.body);
  const { age, mobile, username, userid } = req.body;

  const image = req.file.filename;

  const newAcc = await Account.create({
    image,
    age,
    mobile,
    username,
    user_id: userid,
  });

  if (newAcc) {
    console.log(newAcc);
    res.status(200).json({ newAcc });
  } else {
    console.log("somthing went wrong");
  }
});

module.exports = Router;
