const express = require("express");
const multer = require("multer");
const {
  registerUser,
  getUsers,
  loginUser,
  getUserById,
  updateUser,
  uploadProfilePhoto,
  getProfilePhoto,
} = require("../controllers/AuthController");
const validateEmail = require("../middleware/validateEmail");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/users", getUsers);
router.post("/register", validateEmail, registerUser);
router.post("/login", loginUser);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.post(
  "/user/:id/photo",
  upload.single("profile_photo"),
  uploadProfilePhoto
);
router.get("/user/:id/photo", getProfilePhoto);

module.exports = router;
