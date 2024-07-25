const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
