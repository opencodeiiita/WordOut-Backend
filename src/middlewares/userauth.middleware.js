const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const authMiddleware = async (req, res, next) => {
    const token = req.headers ? req.headers.token : null;
    
    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    jwt.verify(token, process.env.SECRET, async function (err, decode) {
        if(err) 
            return res.status(401).json({ message: "Invalid token" });

        const user = await User.findById(decode.userId);
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.userId = user.userId;
        req.user = user;
        next();
    });
}
module.exports = authMiddleware;