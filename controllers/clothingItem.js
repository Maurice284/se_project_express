const clothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const {
  SERVER_ERROR,
  OK,
  // NO_CONTENT,
  BAD_REQUEST_ERROR,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");

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

const getItems = (req, res) => {
  clothingItem
    .find({})
    .sort({ createdAt: -1 }) // Sort by creation date descending
    .then((items) => res.status(OK).send(items))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
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
        return res
          .status(FORBIDDEN)
          .send({ message: "Forbidden: You do not own this item" });
      }
      return clothingItem
        .findByIdAndDelete(itemId)
        .then((deletedItem) => res.status(OK).send(deletedItem));
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Item Not Found" });
      } else if (err.name === "CastError") {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Error Invalid Item Id" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Error from deleteItem" });
      }
    });
};

const addLike = (req, res) => {
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
        return res.status(BAD_REQUEST_ERROR).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Error Invalid Item Id" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Error from deleteItem" });
    });
};

const removeLike = (req, res) => {
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
        return res.status(NOT_FOUND).send({ message: "NotFound" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "BadRequest" });
      }
      console.log(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "Error from deleteItem" });
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
