const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {

       await mongoose.connect(db);
       console.log("Connected");
        
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDB;