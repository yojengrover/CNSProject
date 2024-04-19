const express = require('express');
const mongoose = require('mongoose');
const User = require('./model');

const app = express();
const PORT = 8000;
const cors = require('cors')
app.use(cors());
app.use(express.json());



async function connect() {
    try {

       await mongoose.connect(uri);
       console.log("Connected");
        
    } catch (error) {
        console.error(error);
    }
}

connect()

app.use('/api/auth', require('./routes/Auth'));




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
