const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pulsehunt');

mongoose.connection.on('connected', () => {
  // eslint-disable-next-line
  console.log('Mongoose connected!');
});
