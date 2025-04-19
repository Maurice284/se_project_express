const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    // s bcrypt.hash("longpass", 10).then((hashedPassword)=>{}) 1982d1982d8192jd182jd9182dj918j2d8912d
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false, // This prevent the password from being returned in queries by defailt
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select({ password: true })
    .then((user) => {
      if (!user || !password) {
        const error = new Error("Incorrect email or password");
        error.name = "AuthorizationError";
        return Promise.reject(error);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user; // now user is available
      });
    });
};

module.exports = mongoose.model("user", userSchema);
