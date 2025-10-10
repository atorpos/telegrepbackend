# Phone Data API Setup Guide

## Prerequisites
1. MySQL server running locally
2. MongoDB server running locally
3. Node.js installed

## Database Setup

### MySQL Setup
1. Run the SQL script to create the database and table:
   ```sql
   -- Execute the contents of database/mysql_setup.sql in your MySQL client
   ```
2. Update your MySQL credentials in `config/dbConfig.js` if needed

### MongoDB Setup
MongoDB will automatically create the database and collection when first used.

## Configuration
Update `config/dbConfig.js` with your database credentials:
```javascript
mysql: {
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'teleprep_db'
},
mongodb: {
  uri: 'mongodb://localhost:27017/teleprep_db'
}
```

## API Endpoint

### POST /phone
Accepts phone data and stores it in both MySQL and MongoDB databases.

**Request Body:**
```json
{
  "phone": "1234567890",
  "time": "2025-10-10T12:00:00Z",
  "ip": "192.168.1.1",
  "deviceType": "Android"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Data successfully saved to both databases",
  "data": {
    "phone": "1234567890",
    "time": "2025-10-10T12:00:00Z",
    "ip": "192.168.1.1",
    "deviceType": "Android",
    "mysql": { "insertId": 1 },
    "mongodb": { "_id": "..." }
  }
}
```

**Duplicate Phone Response (409):**
```json
{
  "success": false,
  "message": "Phone number already exists in database",
  "data": {
    "phone": "1234567890",
    "exists": { "mysql": true, "mongodb": true }
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "phone, time, ip, and deviceType are required."
}
```

## How It Works
1. The endpoint validates all required fields are present
2. Checks if the phone number already exists in both databases
3. If phone exists in either database, returns a conflict response
4. If phone doesn't exist, inserts the data into both MySQL and MongoDB
5. Returns success with insertion details from both databases

## Testing
You can test the endpoint using curl, Postman, or any HTTP client:

```bash
curl -X POST http://localhost:3000/phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "time": "2025-10-10T12:00:00Z",
    "ip": "192.168.1.1",
    "deviceType": "Android"
  }'
```
