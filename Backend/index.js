const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const authHeader = req.headers['authorization']; // Get token from Authorization header
  if (!authHeader) return res.status(401).json("Access Denied: No Token Provided");

  const token = authHeader.split(' ')[1]; // Extract the token part from Bearer Token
  console.log("Received token:", token); // Debugging: log received token

  if (!token) return res.status(401).json("Access Denied: No Token Provided");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error("Token has expired:", err); // Log expired token error
        return res.status(401).json({ message: "Your session is about to time out. Please login again." });
      } else {
        console.error("Token verification failed:", err);
        return res.status(403).json("Invalid Token");
      }
    }
    req.user = user;
    next(); // Proceed to the next route
  });
}

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connected successfully!");
  }
});

const saltRounds = 10;

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

  // Check if the email is already used
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
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const sql = "INSERT INTO users (username, email, type, password) VALUES (?, ?, ?, ?)";
      const values = [username, email, type, hashedPassword];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        // Generate JWT token with 10 seconds expiration
        const token = jwt.sign({ username, email, type }, JWT_SECRET, {
          expiresIn: '1h', // Token expires in 10 seconds
        });

        console.log("Generated JWT Token (Registration):", token); // Log the token to console

        // Log the signup action
        logUserAction(result.insertId, 'signup');

        console.log("User registered successfully.");
        return res.json({ message: "User registered successfully", token });
      });
    } catch (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Error hashing password" });
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

    // Compare the password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Generate JWT token if login is successful
    const token = jwt.sign({ username: user.username, email: user.email, type: user.type }, JWT_SECRET, {
      expiresIn: '1h', // Token expires in 10 seconds
    });

    console.log("Generated JWT Token (Login):", token); // Log the token to console

    // Log the login action
    logUserAction(user.id, 'login');

    console.log("User logged in successfully.");
    return res.json({ message: "Login successful", token, type: user.type }); // Return token & user type
  });
});

// Route for user logout (optional, if you want to handle logout)
app.post("/logout", authenticateToken, (req, res) => {
  // Log the logout action
  logUserAction(req.user.id, 'logout');

  console.log("User logged out successfully.");
  return res.json({ message: "Logout successful" });
});





// Route to fetch user actions (Admin only access)
app.get("/user-actions", authenticateToken, (req, res) => {
  // Only allow Admins to access this route
  if (req.user.type !== "Admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  const sql = "SELECT user_id, action, action_time FROM user_actions"; // Fetch actions from the user_actions table

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






// Route to fetch user details (Admin only access)
app.get("/users", authenticateToken, (req, res) => {
  // Only allow Admins to access this route
  if (req.user.type !== "Admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }


  
  // Query to select all users (without exposing passwords)
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

app.listen(8085, () => {
  console.log("Backend is running successfully on port 8085.");
});
