const sql = require('mysql2/promise');

const db = sql.createPool({
    host: 'localhost',
    user: 'admin',
    password: '12345',
    database: 'task_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = db;
