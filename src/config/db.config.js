require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');

const connectionURL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wordout-backend';

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = mongoose.connection;