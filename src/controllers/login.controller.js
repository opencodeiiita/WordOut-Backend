const User = require("../models/User");

const LoginController = {
    login: async (req, res) => {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ result: false, error: "Email or password is null", message: "Both email and password should be provided" });
        }

        const result = await User.findOne({ email });
        if (!result) {
            return res.status(401).json({ result: false, error: "User not found with that email", message: "Invalid Email or Password" });
        }

        const userId = result.userId;
        const isMatch = result.comparePassword(password);

        if (isMatch) {
            // 30min session
            const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '30m' });

            res.status(200).json({ token, result: true, error: "", message: "Successfully logged in" });
        }
        else {
            res.status(401).json({ result: false, error: "Invalid or wrong password", message: "Invalid Email or Password" });
        }
    }
};

module.exports = LoginController;