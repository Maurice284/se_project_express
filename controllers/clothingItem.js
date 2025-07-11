const clothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const { OK } = require("../utils/errors");

const createItem = (req, res, next) => {
  // console.log("is this firing bro");
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner })

    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .sort({ createdAt: -1 }) // Sort by creation date descending
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  // before we delete the item, we need to check if the currently logged-in user owns this item
  // and only allow them to delete it if they own it
  console.log(itemId);
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      console.log(item.owner.toString());
      console.log(req.user._id);
      if (item.owner.toString() !== req.user._id) {
        return next(new ForbiddenError("Forbidden: You do not own this item"));
      }

      return clothingItem
        .findByIdAndDelete(itemId)
        .then((deletedItem) => res.status(OK).send(deletedItem));
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("ID not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Error Invalid Item Id"));
      }
      return next(err);
    });
};

const addLike = (req, res, next) => {
  const { itemId } = req.params;

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Error Invalid Item Id"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("ID not found"));
      }

      return next(err);
    });
};

const removeLike = (req, res, next) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("ID not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Error Invalid Item Id"));
      }
      console.log(err);

      return next(err);
    });
};

// const updateItem = (req, res) => {
//   res.status(OK).send({ message: "Updating item" });
// };

module.exports = {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  addLike,
  removeLike,
};
