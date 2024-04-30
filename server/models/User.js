const mongoose = require('mongoose');
const scheduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      files:{
        type: Array
      }
});
  
 
  const User = mongoose.model('User', scheduleSchema);
  
  module.exports = User;