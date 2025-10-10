// Database configuration
// Update these values according to your local setup

module.exports = {
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'teleprep_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/teleprep_db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
};
