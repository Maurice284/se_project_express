const clothingItem = require("../models/clothingItem");
const {
  SERVER_ERROR,
  OK,
  NO_CONTENT,
  BAD_REQUEST_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError")
        res.status(BAD_REQUEST_ERROR).send({ message: "Bad Request" });

      res.status(SERVER_ERROR).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(OK).send(items))
    .catch((e) => {
      res.status(SERVER_ERROR).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  clothingItem
    .findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK).send({ data: item }))
    .catch((e) => {
      res.status(SERVER_ERROR).send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  clothingItem
    .findByIdAndUpdate(itemId)
    .orFail()
    .then((item) => res.status(NO_CONTENT).send({}))
    .catch((e) => {
      res.status(SERVER_ERROR).send({ message: "Error from deleteItem", e });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
