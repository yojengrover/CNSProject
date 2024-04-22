const express = require('express');
const connectDB = require('./config/db');
const User = require('./models/User');
const sha256 = require('./routes/sha256');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8000;
const cors = require('cors')
app.use(cors());
app.use(express.json());




connectDB();

app.use('/signup', require('./routes/SignUp'));
app.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;
   const dbPass = await User.findOne({email});
   const db_password_hash = dbPass.password;

   const form_password = password;
   form_password_hash = sha256(form_password);

   if (form_password_hash.length !== db_password_hash.length) {
      console.log("Password not match");
   }
   let match = true;
   for (let i = 0; i < form_password_hash.length; i++) {
      if (form_password_hash.charCodeAt(i) !== db_password_hash.charCodeAt(i)) {
          match = false;
      }
   }
   if (match) {
      res.json({msg: "Match", name: dbPass.name});  
   console.log("Password match");
       
   } else {
     console.log("Password not match");
   }


}
  catch (err){
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
