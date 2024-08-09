const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.status(200).json(rows); // Send the users as JSON response
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { getUsers };

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
    // Log the email received
    console.log("Email received:", email);

    // Validate email format server-side
    const emailRegex = /^[a-zA-Z]+(\.[a-zA-Z]+)*@avocarbon\.com$/;
    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // Check if the email already exists
    const emailCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [trimmedEmail]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, function, department, email, password, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        firstname,
        lastname,
        userFunction,
        department,
        email,
        hashedPassword,
        role,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: rows[0].id,
        email: rows[0].email,
        role: rows[0].role,
      },
    };

    jwt.sign(payload, "jwtSecret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: payload.user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, getUsers, loginUser };
