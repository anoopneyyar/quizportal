const express = require("express");
const quizmodel = require("../models/quiz");
const bcrypt = require('bcrypt');
const app = express();
const Jwt= require('jsonwebtoken');
const quiz = require("../models/quiz");

function auth (request,response,next){
   
    
    if(!request.header('Authorization'))
    {
        response.status(400).send({message:'Not Authorized for this operation !',status:400})
    }
    else
    {
        const token= request.header('Authorization').replace('Bearer ',''); 
    const verify= Jwt.verify(token,"thisisasimplesecret",(error, decoded)=>{
      if(error)
      {
        response.status(400);
        response.json({Status:"400",Message:"Not Authorized to do this operation !"});
      }
      else
      {   request._id=decoded._id;
          request.email=decoded.email;
          request.role=decoded.role;
        next();
      }
      
    })
}
  }
  app.post('/addquestion',auth,async (req,res)=>{
      const quiz= new quizmodel;
      quiz.category_id= req.body.category_id;
       quiz.question= req.body.question;
       quiz.option1= req.body.option1;
       quiz.option2= req.body.option2;
       quiz.option3= req.body.option3;
       quiz.option4= req.body.option4;
       quiz.option5= req.body.option5;
       quiz.answer= req.body.answer;
       quiz.explanation= req.body.explanation;
       quiz.status=req.body.status;

       try{
      await quiz.save();
      res.status(201).send({Message:'Question added successfully',status:'201'})
       }
       catch(e)
       {
      res.status(400).send({Message:'Something went wrong !',Status:'400'});
       }
  })
  app.get('/allquestions',async (req,res)=>{
      try{
      const allquestions= await quizmodel.find({}).select('-_id');
     // console.log(allquestions);
      res.send(allquestions);
      }
      catch(e)
      {
        res.status(400).send('Something went wrong !');
      }
  })
  app.get('/question/:cat_id',async (req,res)=>{

    try{
    const cat_id= req.params.cat_id;
    const data= await quizmodel.find({'category_id':cat_id}).select('-_id')
    res.status(200);
    res.send(data);
    }
    catch(e){
      res.status(400).send(e);
    }

  })

  app.get('/noofquestions/:cat_id',async (req,res)=>{

    try{
      const cat_id= req.params.cat_id;
      const data= await quizmodel.count({'category_id':cat_id});
      res.status(200).send({count:data,status:'200'})
    }
      catch(e){
        console.log(e)
        res.status(400).send(e);
      }
    

  })

  app.get('/answer/:qstn_id', async (req,res)=>{
    try{
      const qst_id= req.params.qstn_id;
      const data= await quizmodel.find({'_id':qst_id}).select('answer -_id')
      res.status(200);
      res.send(data);
      }
      catch(e){
        res.status(400).send(e);
      }
  })
  module.exports = app;