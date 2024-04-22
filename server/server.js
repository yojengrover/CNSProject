const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = 8000;
const cors = require('cors')
app.use(cors());
app.use(express.json());



connectDB();

app.use('/signup', require('./routes/SignUp'));




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
