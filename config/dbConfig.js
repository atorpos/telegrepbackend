// Database configuration
// Update these values according to your local setup

module.exports = {
  mysql: {
    host: process.env.MYSQL_HOST || 'ai02-mac-mini.local',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'appuser',
    password: process.env.MYSQL_PASSWORD || '1A2B3c4d5e6f',
    database: process.env.MYSQL_DATABASE || 'appdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://ai02-mac-mini.local:27017/teleprep_db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
};
