const Admin = require("../models/User");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
var CryptoJS = require("crypto-js");
require("dotenv").config();

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
async function adminPost(req, res, next) {
  try {
    const { Email, Password } = req.body;
    console.log(typeof Email, typeof Password);

    Admin.findOne({ Email }, async (err, user) => {
      if (err) {
        return res.status(500).send("Error");
      }
      if (!user) {
        return res
          .status(401)
          .send({ message: "Invalid username or password" });
      } else {
        const passwordMatch = await bcrypt.compare(Password, user.Password);
        console.log(passwordMatch);
        if (passwordMatch) {
        var token = jwt.sign({userID:user._id,userMail:user.Email},process.env.SECRET_KEY,{expiresIn:"5d"});
          res
            .status(200)
            .json({ message: "Login successful", token:token });
        }
        else{
            res
            .status(401)
            .json({ message: "Invalid login details" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}



async function adminRegister(req, res) {
  try {
    const {Name,tc, Email, Password } = req.body;
    let user = await Admin.findOne({Email:Email})
    // Check if the username is already taken
    if (user) {
      console.log(Email);
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);
       
    
    // Save the user to the database
    if(Name && Email &&Password){
        let newUser = await Admin.create({Name, Email, Password: hashedPassword ,tc});
        var token = jwt.sign({userID:newUser._id,userMail:newUser.Email},process.env.SECRET_KEY,{expiresIn:"5d"});
        res.status(201).json({ message: "User registered successfully" ,token:token });
    }
    else{
        res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function changePassword(req, res, next) {
    try {
      const {Password } = req.body;
      const hashedPassword = await bcrypt.hash(Password, 10);
      console.log(req.user)
     await  Admin.findOneAndUpdate(req.user._id,{
      $set:{
        Password:hashedPassword
      }
     })
     res.status(200).json({ message: "Successfully change"})
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

async function getAdmin(req, res, next) {
  try {
    let data = await Admin.find({}).sort({ createdAt: -1 });
    return res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getAdminCount(req, res, next) {
  let count = await Admin.countDocuments({});
  res.json(count);
}

async function getUser(req, res, next) {
  res.send({"user":req.user});
}

async function sendEmailResetPassword(req, res) {
   const {Email} = req.body;
   let user = await Admin.findOne({Email:Email});
   if(user){
     let secret = user._id+process.env.SECRET_KEY
    var token = jwt.sign({userID:user._id},secret,{expiresIn:"15m"});
    var ciphertext = CryptoJS.AES.encrypt((user._id).toString(), 'secret key 123').toString();

    console.log(ciphertext)
 

    let link = `http://localhost:3000/api/user/reset/${ciphertext}/${token}`
    console.log(link)
    res.send("Hello user")
   }else{
    res.status(500).json({ message: "Please Enter right Email" });
   }

}

async function passwordUpdate(req, res) {
  const {Password , id} = req.body;
   const {token} = req.params;
   console.log(id)
     // Decrypt
     var bytes  = CryptoJS.AES.decrypt((id).toString(), 'secret key 123');
     var originalText = bytes.toString(CryptoJS.enc.Utf8);
     console.log(originalText);
   let user = await Admin.findById({_id:originalText});
   if(user){
    if(Password){
      let new_secret = user._id+process.env.SECRET_KEY
      var decoded = jwt.verify(token,new_secret );
      if(decoded){
        const hashedPassword = await bcrypt.hash(Password, 10);
        await  Admin.findOneAndUpdate(user._id,{
          $set:{
            Password:hashedPassword
          }
         })
         res.status(200).json({ message: "Successfully change"})

      }else{
        res.status(500).json({ message: "Not valid token" });
      }
    }else{
      res.status(402).json({ message: "Enter Password" });
    }
   }else{
    res.status(401).json({ message: "Unvalid user" });
   }
 
 

}

module.exports = {
  getAdmin,
  adminPost,
  getAdminCount,
  adminRegister,
  changePassword,
  getUser,
  sendEmailResetPassword,
  passwordUpdate,
};
