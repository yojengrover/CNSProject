const express = require('express');
const connectDB = require('./config/db');
const User = require('./models/User');
require('dotenv').config();
const sha256 = require('./routes/sha256');
const nodemailer = require('nodemailer');
const app = express();
const aes256 = require('aes256');
const fs = require('fs');
const PORT = 8000;
const cors = require('cors')
app.use(cors());
app.use(express.json());
connectDB();


// Configure nodemailer with your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  host:'smtp.ethereal.email',
  port:587,
  secure:false,
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

let trueOTP = ""

app.use('/signup', require('./routes/SignUp'));
app.use('/encrypt', require('./routes/encrypt'));
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
   const trueVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
   trueOTP = trueVerificationCode
   console.log(trueOTP) //remove in prod
   // Send OTP to user's email
  transporter.sendMail({
    from: 'noreply@filestorage.com',
    to: dbPass.email,
    subject: `OTP from Secure File System for ${dbPass.name}`,
    text: `
    Dear User,

Please find the one time password for the Secure File Storage system here.
*OTP: ${trueVerificationCode}*


Please note this otp will expire in 2 minutes. You can request another otp
if it expires.

Thank you,
Team SFS`,
  }, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error);
      res.status(500).send('Error sending OTP');
    } else {
      console.log('OTP sent:', info.response);
      res.status(200).send('OTP sent successfully');
    }
  });
       
   } else {
     console.log("Password not match");
   }

}
  catch (err){
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

app.post('/otp', async (req, res) => {
  try{
    const {otp} = req.body;
   if (trueOTP.length>0) {
      if(trueOTP==otp){
        res.json({msg: "Match", name: "test"});  
      }
  
}}
  catch (err){
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});


app.post('/dec', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log( email);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Decrypt each file associated with the user
    const decryptedFiles = [];
for (const fileObj of user.files) {
  if (!fileObj.file || !fileObj.key) {
    console.error('Missing file or key path:', fileObj);
    continue; // Skip this file and proceed to the next one
  }

  const encryptedFilePath = fileObj.file;
  const encryptedKeyPath = fileObj.key;

  // Read the encrypted file data
  const encryptedFileData = fs.readFileSync(encryptedFilePath);

  // Read the encrypted symmetric key
  const symmetricKey = fs.readFileSync(encryptedKeyPath);

  // Decrypt the file data using the symmetric key
  const decryptedFileData = aes256.decrypt(symmetricKey.toString(), encryptedFileData.toString());

  // Push decrypted file data to the result array
  decryptedFiles.push({
    fileName: encryptedFilePath,
    data: decryptedFileData
  });
}

    res.json(decryptedFiles);
  } catch (err) {
    console.error('Error decrypting files:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});






app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
