const User = require('./models/User');
const sha256 = require('./routes/sha256');
const bcrypt = require('bcryptjs');
  // form_password 203e616837d8cb6651da5f7670c09539-3ac3ef9009457952d3db37d63a83dd8
  // test@12345
  try{
    // const { email, password } = req.body;
   const db_password_hash = "203e616837d8cb6651da5f7670c09539-3ac3ef9009457952d3db37d63a83dd8"

   const form_password = "test@12345";
   form_password_hash = sha256( form_password);

   if (form_password_hash.length !== db_password_hash.length) {
      return "Password not match";
   }
   let match = true;
   for (let i = 0; i < form_password_hash.length; i++) {
      if (form_password_hash.charCodeAt(i) !== db_password_hash.charCodeAt(i)) {
          match = false;
      }
   }
   console.log(db_password_hash)
   console.log(form_password_hash)
   if (match) {
   print("Password match");
       
   } else {
      print( "Password not match");
      return "Password not match"
   }
}
  catch (err){

  }
