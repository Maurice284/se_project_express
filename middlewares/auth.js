const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Unauthorized Error" });
  }
  req.user = payload; // {_id: 192831892311fj92}
  return next();
};
module.exports = auth;
