const express = require('express');
require('./config/db.config');

const app = express();

app.get('/', (req, res) => {
    res.send("Welcome to WordOut Backend");
});

app.listen(4000);