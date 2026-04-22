const mysql = require('mysql2/promise'); // Fíjate en el /promise
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Mensaje de prueba para saber si conecta
pool.getConnection()
    .then(() => console.log("✅ Conexión a MySQL exitosa"))
    .catch(err => console.error("❌ Fallo de conexión a MySQL:", err.message));

module.exports = pool;