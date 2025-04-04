const User = require("../models/user");
const {
  OK,
  SERVER_ERROR,
  CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log("avatar:", avatar);

  User.create({ name, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
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
        return res.status(NOT_FOUND).send({ message: err.message });
      } // ( handle the cast error)
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }

      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
