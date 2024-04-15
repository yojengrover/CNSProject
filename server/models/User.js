const mongoose = require('mongoose');
const scheduleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    filearray: {
        type: [String], // Assuming filearray contains file paths
        default: []
    }
});
  
 
  const User = mongoose.model('User', scheduleSchema);
  
  module.exports = User;