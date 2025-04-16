const User = require("../models/user");
const {
  OK,
  SERVER_ERROR,
  CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");

// GET /users

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {})
    .catch((err) => {});
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log("avatar:", avatar);
  bcrypt
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
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "An error has occurred on the server" });
      } // ( handle the cast error)
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "An error has occurred on the server" });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser, login };
