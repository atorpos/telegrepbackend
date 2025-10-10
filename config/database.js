const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const dbConfig = require('./dbConfig');

// MySQL connection using config
const mysqlConnection = mysql.createPool(dbConfig.mysql);

// MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(dbConfig.mongodb.uri, dbConfig.mongodb.options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// MongoDB Schema
const phoneDataSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  time: { type: String, required: true },
  ip: { type: String, required: true },
  deviceType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PhoneData = mongoose.model('PhoneData', phoneDataSchema);

module.exports = {
  mysqlConnection,
  connectMongoDB,
  PhoneData
};
