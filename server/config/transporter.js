const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "arjunhl3600@gmail.com",
    pass: "bdvjzzrdbxgrqeru",
  },
});

module.exports = transporter;
