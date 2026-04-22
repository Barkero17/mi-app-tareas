const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function arreglarBaseDeDatos() {
    console.log(`\n🔍 Conectando a la base de datos: "${process.env.DB_NAME}"`);
    
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // 1. Borramos la tabla vieja
        console.log("🗑️ Borrando la tabla 'tareas' antigua...");
        await pool.query('DROP TABLE IF EXISTS tareas');

        // 2. Creamos la tabla NUEVA con fecha, hora, prioridad y estado completado
        console.log("🏗️ Creando la nueva tabla avanzada...");
        await pool.query(`
            CREATE TABLE tareas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                texto VARCHAR(255) NOT NULL,
                usuario_id INT NOT NULL,
                fecha DATE,
                hora TIME,
                prioridad VARCHAR(10) NOT NULL,
                completada BOOLEAN DEFAULT FALSE
            )
        `);

        console.log("✅ ¡REPARACIÓN COMPLETADA! La tabla ya tiene fecha, hora y prioridad.");
        process.exit(0);

    } catch (error) {
        console.error("❌ ERROR CRÍTICO:", error.message);
        process.exit(1);
    }
}

arreglarBaseDeDatos();