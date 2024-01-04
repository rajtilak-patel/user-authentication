const Admin = require("../models/User");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require("dotenv").config();

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
      // const {Password } = req.body;
      console.log(req.user)
      res.status(402).json({ message: "Not found" });
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

module.exports = {
  getAdmin,
  adminPost,
  getAdminCount,
  adminRegister,
  changePassword,
};
