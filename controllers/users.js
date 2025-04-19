const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
const { JWT_SECRET } = require("../utils/config");

// GET /users

const login = (req, res) => {
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
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Unauthorize error" });

      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(OK).send(users))
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

const createUser = (req, res) => {
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
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUserData = (req, res) => User.findByIdAndUpdate(
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
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      } 
        return res.status(SERVER_ERROR).send({ message: "Error from server" });
      
    });

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
  // getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUserData,
};
