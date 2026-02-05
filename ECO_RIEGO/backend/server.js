const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const plantConfigRoutes = require('./routes/plantConfig');
const userRoutes = require('./routes/user');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/plantConfig', plantConfigRoutes);
app.use('/api/user', userRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
