require('dotenv').config();  // Load environment variables

const mongoose = require('mongoose');


if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);  
}


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(function() {
    console.log("connected to mongo db");
  })
  .catch(function(err) {
    console.error("Error connecting to MongoDB:", err);
  });

module.exports = mongoose.connection;
