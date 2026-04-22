require('dotenv').config();
const express = require('express');
const conexion = require('./db.js');

const app = express();
const PORT = 3000;

// Configuración para leer JSON y servir archivos estáticos (HTML, CSS, JS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ---------------------------------------------------------
// 1. OBTENER TAREAS (Ordenadas por fecha y hora)
// ---------------------------------------------------------
app.get("/api/tareas", (req, res) => {
    // Ordenamos por fecha ASC (las más cercanas primero) y luego por hora
    const sql = "SELECT * FROM tareas ORDER BY fecha ASC, hora ASC";
    
    conexion.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error al obtener tareas:", err);
            return res.status(500).json({ error: "Error al leer la base de datos" });
        }
        res.json(resultados);
    });
});

// ---------------------------------------------------------
// 2. GUARDAR UNA NUEVA TAREA
// ---------------------------------------------------------
app.post("/api/tareas", (req, res) => {
    const { titulo, fecha, hora, prioridad } = req.body;

    if (!titulo) {
        return res.status(400).send("El título es obligatorio");
    }

    const sql = "INSERT INTO tareas (titulo, fecha, hora, prioridad) VALUES (?, ?, ?, ?)";
    
    conexion.query(sql, [titulo, fecha, hora, prioridad], (err, resultado) => {
        if (err) {
            console.error("Error al insertar:", err.message);
            return res.status(500).send("No se pudo guardar la tarea");
        }
        res.status(200).send("Tarea guardada correctamente");
    });
});

// ---------------------------------------------------------
// 3. ELIMINAR UNA TAREA ESPECÍFICA (Por su ID)
// ---------------------------------------------------------
app.delete("/api/tareas/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM tareas WHERE id_tarea = ?";

    conexion.query(sql, [id], (err, resultado) => {
        if (err) {
            console.error("Error al eliminar tarea:", err.message);
            return res.status(500).send("Error al borrar la tarea");
        }
        res.status(200).send("Tarea eliminada con éxito");
    });
});

// ---------------------------------------------------------
// 4. ELIMINAR TODAS LAS TAREAS (Reset de la lista)
// ---------------------------------------------------------
app.delete("/api/tareas_todas", (req, res) => {
    const sql = "DELETE FROM tareas";

    conexion.query(sql, (err, resultado) => {
        if (err) {
            console.error("Error al vaciar tabla:", err.message);
            return res.status(500).send("Error al vaciar la lista");
        }
        res.status(200).send("Todas las tareas han sido borradas");
    });
});

// ---------------------------------------------------------
// INICIAR SERVIDOR
// ---------------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});