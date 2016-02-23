var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var dataSchema = new mongoose.Schema({
  latitude: Number,
  longditude: Number,
  speed: Number
});


var Data = mongoose.model('Data', dataSchema);

module.exports = Data;
