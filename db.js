const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pulsehunt');

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected!');
});
