// POST /api/tareas -> Crear una nueva tarea
router.post('/', async (req, res) => {
    // Extraemos los datos del cuerpo de la petición [cite: 229]
    const { titulo, descripcion, fecha_fin, prioridad, id_usuario } = req.body;
    
    try {
        // La consulta debe tener el mismo número de columnas y signos de interrogación 
        const [result] = await db.query(
            'INSERT INTO TAREA (titulo, descripcion, fecha_fin, prioridad, id_usuario, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [titulo, descripcion, fecha_fin, prioridad, id_usuario, 'pendiente']
        );
        res.json({ id: result.insertId, message: "Tarea creada" }); // [cite: 232]
    } catch (err) {
        console.error("Error en MySQL:", err); // Esto imprimirá el error real en tu terminal
        res.status(500).json({ error: err.message });
    }
});