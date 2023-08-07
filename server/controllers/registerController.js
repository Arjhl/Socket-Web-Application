const User = require("../model/user");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  //password validation is handled in frontend
  console.log(req.body);
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const hash = await bcrypt.hash(pass, 10);

  const duplicate = await User.findOne({ email: email }).exec();

  if (duplicate) return res.sendStatus(409);
  try {
    const result = await User.create({
      email: email,
      pass: hash,
      createdAt: new Date(),
    });

    console.log(result);

    return res.status(201).json({ data: result });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { handleNewUser };
