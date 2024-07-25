const express = require("express");
const {
  registerUser,
  getUsers,
  loginUser,
} = require("../controllers/AuthController");
const validateEmail = require("../middleware/validateEmail");

const router = express.Router();

router.get("/users", getUsers);
router.post("/register", validateEmail, registerUser);
router.post("/login", loginUser);

module.exports = router;
