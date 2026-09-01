const mongoose = require('mongoose');
const dns = require('dns');

// Use public DNS servers for SRV lookups to avoid local DNS refusal (ECONNREFUSED)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`DB Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;