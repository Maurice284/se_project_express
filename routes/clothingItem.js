const router = require("express").Router();

const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");
const { validateId } = require("../middlewares/validation");
const { validateClothingItem } = require("../middlewares/validation");

// all endpoints here start with /items

router.get("/", getItems); // /items/

// router.use("/", auth)

router.post("/", auth, validateClothingItem, createItem);

// router.get("/:itemId", updateItem);

router.delete("/:itemId", auth, validateId, deleteItem); // /items/:itemId

router.put("/:itemId/likes", auth, validateId, addLike); // /items/:itemId/likes

router.delete("/:itemId/likes", auth, validateId, removeLike);

module.exports = router;
