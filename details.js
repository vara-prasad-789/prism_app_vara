const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'vider-db.ctnm6mdla58b.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'viderBusiness!123',
  database: 'vider',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testing the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database!');
    connection.release(); // Release the connection
  }
});

module.exports = pool; // Export the connection pool for reuse
