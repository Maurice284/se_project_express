const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("authoriztion for header not found"));
  }

  // 'Bearer asdfasdf'
  // ' asdfasdf'
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return next(new UnauthorizedError("Unauthorized Error"));
  }
  req.user = payload; // {_id: 192831892311fj92}
  return next();
};
module.exports = auth;
