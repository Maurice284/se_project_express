const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Reusable custom URL validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// 1. Clothing item creation
const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string().required().custom(validateURL),
  }),
});

// 2. User creation
const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isEmail(value)) {
          return helpers.error("string.email");
        }
        return value;
      }),
    password: Joi.string().required(),
  }),
});

// 3. Login (authentication)
const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isEmail(value)) {
          return helpers.error("string.email");
        }
        return value;
      }),
    password: Joi.string().required(),
  }),
});

// 4. ID validation (e.g., in URL params)
module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "ID must be a valid hexadecimal string",
      "string.length": "ID must be exactly 24 characters long",
      "string.empty": "ID is required",
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateAuthentication,
  validateURL,
  validateId,
};
