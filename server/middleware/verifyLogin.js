const jwt = require("jsonwebtoken");

const verifyLogin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization) return res.sendStatus(401);

    const verify = await jwt.verify(authorization, process.env.SECRET_KEY);
    console.log(verify);

    // if (!verify) return res.sendStatus(401);

    next();
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(401);
  }
};

module.exports = verifyLogin;
