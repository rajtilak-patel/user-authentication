const user = require("../models/User.js");
var jwt = require('jsonwebtoken');
require("dotenv").config();

console.log("auth",process.env.SECRET_KEY)
async function authUser(req, res, next) {
    console.log("auth",process.env.SECRET_KEY)
    let token;
    const { authorization } = req.headers;
      if(authorization && authorization.startsWith('Bearer')){
        try {
            token = authorization.split(' ')[1];
            const {userID , Email} = jwt.verify(token,process.env.SECRET_KEY)
            console.log(userID ,Email)
            req.user = await user.findById({_id:userID}).select("-Password")
            next()
        } catch (error) {
            console.log(error)
            res.status(402).json({ message: "Unauthorized User" });
        }
      }
     if(!token){
        res.status(404).json({ message: "Unauthorized user No token" });
     }
  }

  module.exports = authUser;
  