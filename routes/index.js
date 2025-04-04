const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const clothingItem = require("./clothingItem");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Not Found" });
});

module.exports = router;
