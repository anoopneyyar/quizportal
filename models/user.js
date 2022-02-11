const { strictEqual } = require("assert");
const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  mobile:{
    type:Number,
    required:true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required:true
   },
   role:{
     type:Number,
     required:true
   }, 
  status:{
    type:Boolean,
    required:true
  },

});

const Users = mongoose.model("user", UsersSchema);

module.exports = Users;