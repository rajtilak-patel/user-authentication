// db/connection.js
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);
// Your MongoDB connection URI
const dbURI = process.env.DB_URL;

// Connect to the database
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Event listeners for connection events
mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});


// Export the Mongoose instance
module.exports = mongoose;
