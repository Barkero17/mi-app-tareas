const mysql = require("mysql");

// El require('dotenv').config() ya se ejecutó en index.js, 
// así que aquí process.env ya tiene tus secretos guardados.

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME
});

conexion.connect((error) => {
  if (error) {
    console.log("Error de conexión:", error);
  } else {
    console.log("Conectado a la base de datos de forma segura");
  }
});

module.exports = conexion;