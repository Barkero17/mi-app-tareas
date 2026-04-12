require('dotenv').config(); // Esta línea debe ser la número 1
const express = require('express');
// ... resto del código
const app = express();
const path = require('path');

// Middlewares para entender JSON y servir archivos estáticos (tu HTML/CSS)
app.use(express.json());
app.use(express.static('frontend')); 

// Importar rutas (las crearemos en el siguiente paso)
const tareasRoutes = require('./routes/tareas');
const authRoutes = require('./routes/auth');

// Usar las rutas siguiendo tu diseño de API REST [cite: 247, 248]
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareasRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});