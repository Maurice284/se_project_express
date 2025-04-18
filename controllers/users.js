const User = require("../models/user");
const {
  OK,
  SERVER_ERROR,
  CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// GET /users

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
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

const updateUserData = (req, res) => {
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
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "An error has occurred on the server" });
      } else if (err.name === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: "Error from server" });
      }
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
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

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUserData,
};
