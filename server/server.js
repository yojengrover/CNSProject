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

  // form_password 21c516ad487b79c172754d844da7a66e45bde30a1eb725f93ff9ec6247d7adb9
  // test@12345
  try{
    const { email, password } = req.body;
   const db_password_hash = await User.findOne({email}).select('-password');

   const form_password = password;
   form_password_hash = sha256(form_password);

   if (form_password_hash.length !== db_password_hash.length) {
      return "Password not match";
   }
   let match = true;
   for (let i = 0; i < form_password_hash.length; i++) {
      if (form_password_hash.charCodeAt(i) !== db_password_hash.charCodeAt(i)) {
          match = false;
      }
   }
   if (match) {
      res.json({msg: "Match"});  
   console.log("Password match");
       
   } else {
      return "Password not match";
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
