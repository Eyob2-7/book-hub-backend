const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bookRoutes = require("./routes/book/bookRoutes");
const authRoutes = require("./routes/User/authRoutes");

// Creating an express instance
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// JWT Authentication middleware
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

// Define routes
//app.use("/api/book", bookRoutes);
app.use("/api/book", authenticateJWT, bookRoutes);
app.use("/api/auth", authRoutes);

// Set up the server
const PORT = 8002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));