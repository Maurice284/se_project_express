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

//all endpoints here start with /items

router.get("/", getItems); // /items/

//router.use("/", auth)

router.post("/", auth, createItem);

// router.get("/:itemId", updateItem);

router.delete("/:itemId", auth, deleteItem); // /items/:itemId

router.put("/:itemId/likes", auth, addLike); // /items/:itemId/likes

router.delete("/:itemId/likes", auth, removeLike);

module.exports = router;
