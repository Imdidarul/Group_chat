const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token missing" });
        }

        const token = authHeader.split(" ")[1]; // "Bearer TOKEN"

        const decoded = jwt.verify(token, process.env.AUTH_SECRET_KEY);

        req.user = decoded; // attach user info
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};