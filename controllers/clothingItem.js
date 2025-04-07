const clothingItem = require("../models/clothingItem");
const {
  SERVER_ERROR,
  OK,
  // NO_CONTENT,
  BAD_REQUEST_ERROR,
  NOT_FOUND,
} = require("../utils/errors");

const createItem = (req, res) => {
  // console.log("is this firing bro");
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner })

    .then((item) => {
      console.log(item);
      return res.send({ data: item });
    })
    .catch((e) => {
      // console.log(e);
      if (e.name === "ValidationError")
        return res.status(BAD_REQUEST_ERROR).send({ message: "Bad Request" });

      return res
        .status(SERVER_ERROR)
        .send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(OK).send(items))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Not Found" });
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

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Bad Request" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Error Invalid Item Id" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Error from deleteItem" });
      }
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
    .catch((e) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "NotFound" });
      }
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "BadRequest" });
      }
      console.log(e);
      res.status(SERVER_ERROR).send({ message: "Error from deleteItem" });
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
