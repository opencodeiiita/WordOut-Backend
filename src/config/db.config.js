require('dotenv').config();  // Load environment variables

const mongoose = require('mongoose');

// Connect to MongoDB using the environment variable
mongoose.connect(`${process.env.MONGO_URI}/ecommerce`)
  .then(function() {
    console.log("connected to mongo db");
  })
  .catch(function(err) {
    console.log(err);
  });

module.exports = mongoose.connection;
