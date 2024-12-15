const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const AuthController = {
    login: async (req, res) => {

        const { email, password } = req.body;

        if(!email || !password){
            return res.status(401).json({result: false, error: "Email or password is null", message: "Both email and pswd should be provided" });
        }

        const result = await User.findOne({email});
        if (!result) {
            return res.status(401).json({result: false, error: "User not found with that email", message: "Invalid Email or Password" });
        }

        const userId = result.userId;
        const isMatch = await bcrypt.compare(password, result.password);

        if (isMatch) {
            //a 30 min session
            const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '30m' });
            res.cookie('token', token);
            res.status(200).json({result: true, error: "", message: "Successfully logged in" });
        }
        else
            res.status(401).json({ result: false, message: "Invalid or wrong password", error: "Invalid or wrong password" });
    },
    logout: async (req, res) => {
        res.clearCookie('token');
        res.status(200).send();
    }
};

module.exports = AuthController;