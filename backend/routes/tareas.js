const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Tu conexión a MySQL

// GET /api/tareas -> Obtener tareas del usuario [cite: 248]
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM TAREA');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/tareas -> Crear una nueva tarea [cite: 249]
router.post('/', async (req, res) => {
    const { titulo, descripcion, fecha_fin, prioridad, id_usuario } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO TAREA (titulo, descripcion, fecha_fin, prioridad, id_usuario) VALUES (?, ?, ?, ?, ?)',
            [titulo, descripcion, fecha_fin, prioridad, id_usuario]
        );
        res.json({ id: result.insertId, message: "Tarea creada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/tareas/:id -> Eliminar tarea [cite: 251]
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM TAREA WHERE id_tarea = ?', [req.params.id]);
        res.json({ message: "Tarea eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;