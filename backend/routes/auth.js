const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importa la conexión a MySQL sin contraseña

// --- RUTA DE REGISTRO (POST /api/auth/register) ---
router.post('/register', async (req, res) => {
    // Extraemos los campos definidos en el wireframe de Registro [cite: 20]
    const { nombre, email, contraseña } = req.body;

    try {
        // Insertamos en la tabla USUARIO respetando el modelo lógico 
        const [result] = await db.query(
            'INSERT INTO USUARIO (nombre, email, contraseña) VALUES (?, ?, ?)',
            [nombre, email, contraseña]
        );
        
        res.status(201).json({ 
            message: "Usuario creado con éxito", 
            id_usuario: result.insertId 
        });
    } catch (err) {
        console.error("Error en registro:", err);
        res.status(500).json({ 
            error: "Error al registrar: El email ya existe o faltan datos." 
        });
    }
});

// --- RUTA DE LOGIN (POST /api/auth/login) ---
router.post('/login', async (req, res) => {
    // Campos del wireframe de Login: email y contraseña [cite: 18]
    const { email, password } = req.body;

    try {
        // Buscamos al usuario en la base de datos 
        const [users] = await db.query(
            'SELECT * FROM USUARIO WHERE email = ? AND contraseña = ?',
            [email, password]
        );

        if (users.length > 0) {
            // Si el usuario existe, devolvemos su ID para la relación 1:N con las tareas 
            res.json({ 
                id_usuario: users[0].id_usuario, 
                nombre: users[0].nombre 
            });
        } else {
            // Error de autenticación según flujo de datos [cite: 232]
            res.status(401).json({ error: "Email o contraseña incorrectos" });
        }
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;