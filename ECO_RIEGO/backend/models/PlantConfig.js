const mongoose = require('mongoose');
const PlantConfigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  humidityThreshold: { type: Number, required: true },
  temperatureThreshold: { type: Number, required: true },
  plantType: { type: String, required: true },
  programState: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
module.exports = mongoose.model('PlantConfig', PlantConfigSchema);
