const router = require("express").Router();
const {
  // getUsers,
  // createUser,
  getCurrentUser,
  updateUserData,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// endpoints start with /users

router.patch("/me", auth, updateUserData); // /users/me
router.get("/me", auth, getCurrentUser); // http://localhost:3001/users/d1j29dj128dj12d12d

module.exports = router; // req.params = {userId: d1j29dj128dj12d12d}
