const mongoose = require('mongoose');
let data = require('./data').data;
const Listing = require('../models/listing');

// Connect to local MongoDB
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connected to MongoDB");

  // Clear existing listings
  await Listing.deleteMany({});
  console.log("✅ Cleared existing listings");

  // Add Owners to listings
 data= data.map((obj) => ({
      ...obj,
      owner: "68fc7239062e9299c6c1f1fd" // Example user ID
  }));

  // Seed new listings
  await Listing.insertMany(data);
  console.log("✅ Seeded new listings");

  // Close the connection
  await mongoose.connection.close();
  console.log("✅ Closed MongoDB connection");
}
main().catch(err => console.log("❌ MongoDB connection error:", err));