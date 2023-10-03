const User = require("../model/user");
const Account = require("../model/account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res, next) => {
  const { email, pass } = req.body;

  if (!email || !pass)
    return res.status(401).json({ message: "Email and password are required" });

  const foundUser = await User.findOne({ email: email }).exec();

  if (!foundUser)
    return res.status(401).json({ message: "Account does not exist" });

  const match = await bcrypt.compare(pass, foundUser.pass);

  if (!match) {
    return res
      .status(401)
      .json({ message: "Credentials are wrong or doesnt exist." });
  } else {
    try {
      const Token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, {
        expiresIn: "90d",
      });
      console.log("Token generated Successfully");

      const accountData = await Account.findOne({
        user_id: foundUser.id,
      }).exec();

      res.status(200).json({ token: Token, accountData });
    } catch (err) {
      console.log(err);
      res.status(200).json({ message: "Token didnt generate" });
    }
  }
};

module.exports = { handleLogin };
