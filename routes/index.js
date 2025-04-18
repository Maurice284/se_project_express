const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const clothingItem = require("./clothingItem");
const { createUser, login, updateUserData } = require("../controllers/users");

const userRouter = require("./users");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Not Found" });
});

module.exports = router;
