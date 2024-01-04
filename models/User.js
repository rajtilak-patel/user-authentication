const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      // required: true,
      minLength: [2, "Name should contain at least two characters!"],
      trim: true,
    },
    Email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    Phone: {
      type: Number,
      unique: true,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
    },
    tc: {
        type: Boolean,
        require:true,
      },
  },
  {
    timestamps: true,
  }
);

const Admin = new mongoose.model("user", AdminSchema);

module.exports = Admin;
