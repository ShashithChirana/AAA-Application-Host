const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "beudmixugyf5czadnunz-mysql.services.clever-cloud.com",
  user: "uunenyjy7npqyair",
  password: "l9XpBUFrHqGdqD5eoeRY",
  database: "beudmixugyf5czadnunz",
});

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Ensure you store this securely

// Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json("Access Denied: No Token Provided");

  const token = authHeader.split(' ')[1];
  console.log("Received token:", token);

  if (!token) return res.status(401).json("Access Denied: No Token Provided");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error("Token has expired:", err);
        return res.status(401).json({ message: "Your session is about to time out. Please login again." });
      } else {
        console.error("Token verification failed:", err);
        return res.status(403).json("Invalid Token");
      }
    }
    req.user = user;
    next();
  });
}

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connected successfully!");
  }
});

// Function to log user actions
function logUserAction(userId, action) {
  const sql = "INSERT INTO user_actions (user_id, action) VALUES (?, ?)";
  db.query(sql, [userId, action], (err) => {
    if (err) {
      console.error("Error logging user action:", err);
    } else {
      console.log(`User action logged: ${action} for user ID: ${userId}`);
    }
  });
}

// Route for user registration
app.post("/register", async (req, res) => {
  const { username, email, password, type } = req.body;

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], async (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ error: "Email already used" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO users (username, email, type, password) VALUES (?, ?, ?, ?)";
      const values = [username, email, type, hashedPassword];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const token = jwt.sign({ username, email, type }, JWT_SECRET, { expiresIn: '1h' });

        logUserAction(result.insertId, 'signup');
        console.log("User registered successfully.");
        return res.json({ message: "User registered successfully", token });
      });
    } catch (error) {
      console.error("Error hashing password:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
});

// Route for user login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      const token = jwt.sign({ username: user.username, email: user.email, type: user.type }, JWT_SECRET, { expiresIn: '1h' });

      logUserAction(user.id, 'login');
      console.log("User logged in successfully.");
      return res.json({ message: "Login successful", token, type: user.type });
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
});

// Route for user logout (optional)
app.post("/logout", authenticateToken, (req, res) => {
  logUserAction(req.user.id, 'logout');
  console.log("User logged out successfully.");
  return res.json({ message: "Logout successful" });
});

// Route to fetch user actions (Admin only access)
app.get("/user-actions", authenticateToken, (req, res) => {
  if (req.user.type !== "Admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  const sql = "SELECT user_id, action, action_time FROM user_actions";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "No actions found" });
    }

    return res.json({ actions: result });
  });
});




const express = require("express");
const fetch = require("node-fetch");

const app1 = express();
app1.use(express.json());

app1.post("/login", async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "reCAPTCHA token is missing" });
  }

  // Verify the reCAPTCHA token
  const secretKey = "6Lfb8o8qAAAAAD7A6bR27MHNrek3Nyf_IRBbN4pw"; // Replace with your reCAPTCHA secret key
  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
    {
      method: "POST",
    }
  );
  const recaptchaData = await recaptchaResponse.json();

  if (!recaptchaData.success) {
    return res.status(400).json({ error: "Invalid reCAPTCHA" });
  }

  // Handle login logic (authentication, token generation, etc.)
  // ...

  res.status(200).json({ token: "exampleToken", type: "User" }); // Example response
});

app1.listen(8085, () => {
  console.log("Server running on port 8085");
});




// Route to fetch user details (Admin only access)
app.get("/users", authenticateToken, (req, res) => {
  if (req.user.type !== "Admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  const sql = "SELECT username, email, type FROM users WHERE type = 'User'";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    return res.json({ users: result });
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Use environment variable for port or default to 8085
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Backend is running successfully on port ${PORT}.`);
});



