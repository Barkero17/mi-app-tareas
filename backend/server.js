const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./config/db'); 
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, '../public')));

// ==========================================
// 1. RUTAS DE AUTENTICACIÓN (LOGIN/REGISTRO)
// ==========================================

app.post('/api/registro', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, hashedPassword]);
        res.json({ success: true, message: "Usuario creado correctamente" });
    } catch (err) {
        console.error("❌ ERROR EN EL REGISTRO:", err.message);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, error: "Ese email ya está registrado" });
        }
        res.status(500).json({ success: false, error: "Error interno en la base de datos" });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ success: false, error: "El usuario no existe" });

        const match = await bcrypt.compare(password, rows[0].password);
        if (match) {
            res.json({ success: true, message: "¡Bienvenido de nuevo!", userId: rows[0].id });
        } else {
            res.status(401).json({ success: false, error: "La contraseña es incorrecta" });
        }
    } catch (err) {
        console.error("❌ ERROR EN EL LOGIN:", err.message);
        res.status(500).json({ success: false, error: "Error en el servidor" });
    }
});

// ==========================================
// 2. RUTAS DE LAS TAREAS (CRUD COMPLETO)
// ==========================================

// Obtener tareas ordenadas por fecha (las más antiguas/atrasadas arriba)
app.get('/api/tareas/:userId', async (req, res) => {
    try {
        const query = 'SELECT * FROM tareas WHERE usuario_id = ? ORDER BY fecha ASC, hora ASC';
        const [rows] = await db.query(query, [req.params.userId]);
        res.json({ success: true, tareas: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Crear nueva tarea con todos los datos (fecha, hora, prioridad)
app.post('/api/tareas', async (req, res) => {
    const { texto, usuario_id, fecha, hora, prioridad } = req.body;
    try {
        const query = 'INSERT INTO tareas (texto, usuario_id, fecha, hora, prioridad, completada) VALUES (?, ?, ?, ?, ?, false)';
        await db.query(query, [texto, usuario_id, fecha, hora, prioridad]);
        res.json({ success: true, message: "Tarea guardada" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Marcar tarea como completada o no completada (Checkbox)
app.put('/api/tareas/:id', async (req, res) => {
    const { completada } = req.body;
    try {
        await db.query('UPDATE tareas SET completada = ? WHERE id = ?', [completada, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Borrar UNA tarea de forma individual
app.delete('/api/tareas/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM tareas WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Borrar TODAS las tareas de un usuario de golpe
app.delete('/api/tareas/todas/:userId', async (req, res) => {
    try {
        await db.query('DELETE FROM tareas WHERE usuario_id = ?', [req.params.userId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 3. INICIO DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});