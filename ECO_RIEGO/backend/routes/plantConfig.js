const express = require('express');
const router = express.Router();
const PlantConfig = require('../models/PlantConfig');

// GET all configs (o por usuario)
// GET all configs (o por usuario, con populate opcional)
router.get('/', async (req, res) => {
  try {
    const query = req.query.userId ? { userId: req.query.userId } : {};
    const configs = await PlantConfig.find(query).populate('userId', 'username email');
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener configuraciones.' });
  }
});

// POST new config
// POST new config (requiere userId y plantType)
router.post('/', async (req, res) => {
  try {
    console.log('PlantConfig body:', req.body);
    const { userId, name, humidityThreshold, temperatureThreshold, plantType } = req.body;
    if (!userId || !name || humidityThreshold == null || temperatureThreshold == null || !plantType) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
    const config = new PlantConfig({
      userId,
      name,
      humidityThreshold,
      temperatureThreshold,
      plantType
    });
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar la configuración.' });
  }
});

// PUT update config
router.put('/:id', async (req, res) => {
  const config = await PlantConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(config);
});

// DELETE config
router.delete('/:id', async (req, res) => {
  await PlantConfig.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
