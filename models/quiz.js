const { strictEqual } = require("assert");
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  category_id:{
    type:String,
    required:true,
    trim:true
  },
  question:{
    type:String,
    required:true
  },
  option1:{
    type:String,
    required:true
  },
  option2:{
    type:String,
    required:true
  },
  option3:{
    type:String,
    trim: true
  },
  option4:{
    type:String,
    trim:true
  },
  option5:{
    type:String,
    trim:true
    
  },
  answer:{
      type:Number,
      required:true,
      trim:true
  },
  explanation:{
      type:String,
      trim:true
  },

  status:{
    type:Boolean,
    required:true
  },

});

const quiz = mongoose.model("quiz", quizSchema);

module.exports = quiz;