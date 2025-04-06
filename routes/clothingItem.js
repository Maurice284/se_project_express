const router = require("express").Router();

const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItem");

router.post("/", createItem);

router.get("/", getItems);

// router.get("/:itemId", updateItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", addLike);

router.delete("/:itemId/likes", removeLike);

module.exports = router;
