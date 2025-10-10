const { mysqlConnection, PhoneData } = require('../config/database');

class PhoneController {
  // Insert data into MySQL
  async insertToMySQL(phoneData) {
    const { phone, time, ip, deviceType } = phoneData;
    const query = `
      INSERT INTO phone_data (phone, time, ip, device_type, created_at) 
      VALUES (?, ?, ?, ?, NOW())
    `;
    try {
      const [result] = await mysqlConnection.execute(query, [phone, time, ip, deviceType]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Check if phone exists in MySQL
  async checkPhoneExistsMySQL(phone) {
    const query = 'SELECT COUNT(*) as count FROM phone_data WHERE phone = ?';
    try {
      const [rows] = await mysqlConnection.execute(query, [phone]);
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // Insert data into MongoDB
  async insertToMongoDB(phoneData) {
    try {
      const newPhoneData = new PhoneData(phoneData);
      const result = await newPhoneData.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Check if phone exists in MongoDB
  async checkPhoneExistsMongoDB(phone) {
    try {
      const exists = await PhoneData.findOne({ phone });
      return !!exists;
    } catch (error) {
      throw error;
    }
  }

  // Main controller method
  async savePhoneData(phoneData) {
    const { phone, time, ip, deviceType } = phoneData;

    try {
      // Check if phone exists in both databases
      const [mysqlExists, mongoExists] = await Promise.all([
        this.checkPhoneExistsMySQL(phone),
        this.checkPhoneExistsMongoDB(phone)
      ]);

      if (mysqlExists || mongoExists) {
        return {
          success: false,
          message: 'Phone number already exists in database',
          data: { phone, exists: { mysql: mysqlExists, mongodb: mongoExists } }
        };
      }

      // Insert into both databases
      const [mysqlResult, mongoResult] = await Promise.all([
        this.insertToMySQL(phoneData),
        this.insertToMongoDB(phoneData)
      ]);

      return {
        success: true,
        message: 'Data successfully saved to both databases',
        data: {
          phone,
          time,
          ip,
          deviceType,
          mysql: { insertId: mysqlResult.insertId },
          mongodb: { _id: mongoResult._id }
        }
      };

    } catch (error) {
      console.error('Database error:', error);

      // Return different messages based on error type
      if (error.code === 'ER_DUP_ENTRY' || error.code === 11000) {
        return {
          success: false,
          message: 'Phone number already exists',
          error: 'Duplicate entry'
        };
      }

      return {
        success: false,
        message: 'Database operation failed',
        error: error.message
      };
    }
  }
}

module.exports = new PhoneController();
