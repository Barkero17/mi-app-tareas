const express = require('express');
const router = express.Router();

// Ruta de login (POST /api/auth/login) 
router.post('/login', (req, res) => {
    res.json({ message: "Ruta de login funcionando" });
});

// Ruta de registro (POST /api/auth/register) 
router.post('/register', (req, res) => {
    res.json({ message: "Ruta de registro funcionando" });
});

module.exports = router;