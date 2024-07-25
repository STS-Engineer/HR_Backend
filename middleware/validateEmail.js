const validateEmail = (req, res, next) => {
  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@avocarbon\.com$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  next();
};

module.exports = validateEmail;
