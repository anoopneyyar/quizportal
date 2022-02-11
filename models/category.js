const { strictEqual } = require("assert");
const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  cat_name:{
    type:String,
    required:true,
    trim:true
  },
  parent_id:{
    type:String,
    required:true
  },
  cat_slug:{
    type:String,
    required:true
  },
  image_path:{
    type:String,
  },
  status:{
    type:Boolean,
    required:true
  },

});

const category = mongoose.model("category", UsersSchema);

module.exports = category;