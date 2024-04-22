const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sha256 = require('./sha256');

router.get('/',auth, async (req,res) => {
    try{
     const db_password_hash = await User.findById(req.user.id).select('-password');
     ///  - logic
     // form_password is the password submitted in the form
     const form_password_hash = req.user.password
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
        return "Password match";
     } else {
        return "Password not match";
     }


     //// - logic
     res.json(user);   
 }
    catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
 });