const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PlantConfig = require('../models/PlantConfig');
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email ya registrado.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el registro.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login body:', req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Contraseña incorrecta.' });
    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1d' });
    // Cargar configuración de riego del usuario
    const configs = await PlantConfig.find({ userId: user._id });
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      configs
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el login.' });
  }
});

module.exports = router;
