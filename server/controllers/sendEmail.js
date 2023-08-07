const transporter = require("../config/transporter");

async function sendEmail(email, link) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "test", // sender address
      to: email, // list of receivers
      subject: "Verification", // Subject line
      // text: "Hello world?", // plain text body
      html: `<a href=${link}>Click Here to verify<a/>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    return info;
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendEmail;
