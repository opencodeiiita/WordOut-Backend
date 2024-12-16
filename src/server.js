const express = require('express');
const userRoutes = require('./routes/userRoutes');  // Correct path
require('./config/db.config');

const app = express();

app.use(express.json()); // Parse JSON request bodies
app.use('/api/users', userRoutes); // Mount user-related routes

app.get('/', (req, res) => {
    res.send("Welcome to WordOut Backend");
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
