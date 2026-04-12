const express = require("express");
const router = express.Router();
const conexion = require("../db");

// GET -> obtener tareas
router.get("/", (req, res) => {
  conexion.query("SELECT * FROM tareas", (err, resultados) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(resultados);
  });
});

// POST -> crear tarea
router.post("/", (req, res) => {
  const { titulo } = req.body;

  const sql = "INSERT INTO tareas (titulo) VALUES (?)";

  conexion.query(sql, [titulo], (err, resultado) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send("Tarea creada correctamente");
  });
});

module.exports = router;