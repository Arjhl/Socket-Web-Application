const User = require("../model/user");
const Account = require("../model/account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res, next) => {
  const { email, pass } = req.body;
  console.log(req.body);
  if (!email || !pass)
    return res.status(401).json({ message: "Email and password are required" });

  const foundUser = await User.findOne({ email: email }).exec();

  if (!foundUser) res.sendStatus(401);

  const match = await bcrypt.compare(pass, foundUser.pass);
  console.log(match);

  if (match) {
    try {
      const Token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, {
        expiresIn: "90d",
      });
      console.log("Token generated Successfully");

      const accountData = await Account.findOne({
        user_id: foundUser.id,
      }).exec();

      console.log("after login account data", accountData);
      res.status(200).json({ token: Token, accountData });
    } catch (err) {
      console.log(err);
      res.status(200).json({ message: "Token didnt generate" });
    }
  }
};

module.exports = { handleLogin };
