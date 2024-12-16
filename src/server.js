const express = require('express');
const userRoutes = require('./routes/userRoutes');  // Correct path
const authRouter = require('./routes/signup');
require('./config/db.config');

const app = express();

app.use(express.json()); // Parse JSON request bodies
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/api/users', userRoutes); // Mount user-related routes
app.use('/api', authRouter);

app.get('/', (req, res) => {
    res.send("Welcome to WordOut Backend");
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
