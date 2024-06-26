const express = require('express');
const router = express.Router();
const multer = require('multer');
const aes256 = require('aes256');
const fs = require('fs');
const User = require('../models/User');

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files'); // Files will be stored in the 'files' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original file name
  }
});

// Initialize multer with the defined storage
const upload = multer({ storage });

// POST route to receive file, encrypt it, and save encrypted data locally
const crypto = require('crypto');

router.post('/', upload.single('file'), async (req, res) => {
  const { email } = req.body;
   
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Read the uploaded file
    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);

    // Generate a random symmetric key for encryption
    const symmetricKey = crypto.randomBytes(32);

    // Encrypt file data using AES-256
    const encryptedData = aes256.encrypt(symmetricKey.toString('base64'), fileData.toString());

    // Save the encrypted data to a file
    const encryptedFilePath = `files/${req.file.originalname}.enc`;
    fs.writeFileSync(encryptedFilePath, encryptedData);

    // Save the symmetric key to a file
    const encryptedKeyPath = `keys/${req.file.originalname}.key`;
    fs.writeFileSync(encryptedKeyPath, symmetricKey);

    if (!user.files) {
        user.files = []; // Initialize as an empty array if undefined
      }
    user.files.push({ file: encryptedFilePath, key: encryptedKeyPath });
      
    await user.save();
    // Delete the temporary uploaded file
    fs.unlinkSync(filePath);

    res.json({ msg: 'File encrypted and stored successfully' });
  } catch (err) {
    console.error('Error encrypting and storing file:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});




module.exports = router;
