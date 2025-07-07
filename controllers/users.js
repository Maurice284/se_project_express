const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  OK,
  CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizeError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
// GET /users

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "The password and email fields are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password")
        return next(new UnauthorizeError("Unauthorize Error"));

      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  // console.log("avatar:", avatar);
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userCopy = user.toObject();

      delete userCopy.password;

      return res.status(CREATED).send(userCopy);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: "Conflict Error" });
      }
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Bad Request Error"));
      }
      return next(err);
    });
};

const updateUserData = (req, res, next) =>
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      avatar: req.body.avatar,
    },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("User Id Not Found ");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("An error has occurred on the server"));
      }
      if (err.statusCode === NOT_FOUND) {
        return next(new NotFoundError("Error not found"));
      }
      return next(err);
    });

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Error not found"));
      } // ( handle the cast error)
      if (err.name === "CastError") {
        return next(new BadRequestError("An error has occurred on the server"));
      }

      return next(err);
    });
};

module.exports = {
  // getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUserData,
};
