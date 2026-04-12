const mysql = require('mysql2');

// Borra todo lo anterior y pega esto:
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Usuario por defecto en MySQL Workbench
    password: '',      // Déjalo vacío si no usas contraseña
    database: 'proyecto_tareas', // El nombre de tu esquema en Workbench
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportamos la conexión para que auth.js y tareas.js la puedan usar
module.exports = pool.promise();