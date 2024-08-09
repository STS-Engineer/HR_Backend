const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get Users
const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register User
const registerUser = async (req, res) => {
  const {
    firstname,
    lastname,
    function: userFunction,
    department,
    email,
    password,
    role,
  } = req.body;

  try {
    console.log("Email received:", email);

    const emailRegex = /^[a-zA-Z]+(\.[a-zA-Z]+)*@avocarbon\.com$/;
    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, function, department, email, password, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        firstname,
        lastname,
        userFunction,
        department,
        trimmedEmail,
        hashedPassword,
        role,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = {
      user: {
        id: rows[0].id,
        email: rows[0].email,
        role: rows[0].role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET || "jwtSecret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: payload.user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, getUsers, loginUser };
