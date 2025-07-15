const router = require("express").Router();
const clothingItem = require("./clothingItem");
const { createUser, login } = require("../controllers/users");
const {
  validateUserInfo,
  validateAuthentication,
} = require("../middlewares/validation");

const userRouter = require("./users");
const NotFoundError = require("../errors/NotFoundError");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
router.post("/signup", validateUserInfo, createUser);
router.post("/signin", validateAuthentication, login);
router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use(
  (req, res, next) => next(new NotFoundError("Not Found"))
  // res.status(NOT_FOUND).send({ message: "Not Found" });
);

module.exports = router;
