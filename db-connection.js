const mongoose = require('mongoose');
const db = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
if (mongoose.connection.readyState == 2) {
  console.log('Conected to Mongo database');
} else {
  console.log('An error has occur when connecting to database');
}
module.exports = db;