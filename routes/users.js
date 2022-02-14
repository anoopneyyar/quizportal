const express = require("express");
const usermodel = require("../models/user");
const bcrypt = require('bcrypt');
const app = express();
const Jwt= require('jsonwebtoken');
const { json } = require("express");

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

//Change password of a purticular user
app.post('/updatepassword',auth,async (req,res)=>{
  const email= req.body.email;
  const curr_pass= req.body.current_pass;
  const new_pass= req.body.new_pass;
 // console.log(new_pass)
const data_user=await usermodel.findOne({email:email},(err,data)=>{

    if(!data)
    {
      res.status(404);
      res.json({status:404,message:'User Not Found !'});
    }
    else
    {
    bcrypt.compare(curr_pass,data.password,(err,result)=>{
      if(result)
      {
       const newpass= bcrypt.hash(new_pass,8,(err,hash)=>{
        //const _id= JSON.stringify(data._id);
        const updation= usermodel.findOneAndUpdate({_id:data._id},{password:hash},{new:true},(err,doc)=>{
          if(err)
          {
            res.status(400).send({message:'Error Occured !',error:err})
          }
          else{
            res.status(200).send({message: 'Password updated successfully !',name:doc.name,email: doc.email,status:doc.status})
          }
        })
       })
      }
      else
      {
        res.status(404);
        res.json({status:404,message:'Password doesnot match !'})
       
      }
    })
    }
  
  }).clone();
})

//End change password

//Change mobile number of a purticular user
app.post('/updatemobile',auth,async (req,res)=>{
  const email= req.body.email;
  const curr_pass= req.body.current_pass;
  const mobile= req.body.mobile;
 // console.log(new_pass)
const data_user=await usermodel.findOne({email:email},(err,data)=>{

    if(!data)
    {
      res.status(404);
      res.json({status:404,message:'User Not Found !'});
    }
    else
    {
    bcrypt.compare(curr_pass,data.password,(err,result)=>{
      if(result)
      {
     
        //const _id= JSON.stringify(data._id);
        const updation= usermodel.findOneAndUpdate({_id:data._id},{mobile:mobile},{new:true},(err,doc)=>{
          if(err)
          {
            res.status(400).send({message:'Error Occured !',error:err})
          }
          else{
            res.status(200).send({message: 'Mobile Number updated successfully !',name:doc.name,email: doc.email,mobile:doc.mobile,status:doc.status})
          }
        })
       
      }
      else
      {
        res.status(404);
        res.json({status:404,message:'Password doesnot match !'})
       
      }
    })
    }
  
  }).clone();
})  

//End change mobile number

app.get('/users',auth, async (request, response) => {
  //console.log(request.role);
  const role=request.role;
  if(role==1)
  {
  const users = await usermodel.find({}).select('name mobile email status -_id');

  try {
  
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
}
else{
  response.status(400);
  response.send({status:400,message:'Only admin users are allowed to do this operation !'});
}
});

// ...

app.get('/login',async (req,res)=>{
  const email=req.body.email;
  const password= req.body.password;

  await  usermodel.findOne({email:email})
  .then(data => {
    if (!data)
      res.status(404).send({ message: "Not found User with email " + email });
    else
    {
        bcrypt.compare(password,data.password,(error,resolution)=>{
      
          if(resolution==true)
          {
            const id= JSON.stringify(data._id);
            const token= Jwt.sign({_id:id,email:data.
              email,role:data.role},"thisisasimplesecret")
            res.json({token: token});
          }
          else
          {
            res.status(404);
            res.send({Status:404,Message:"Username or password incorrect !"})
          }
        
        })  
   
    }
  })
  .catch(err => {
    res
      .status(500)
      .send({ message: "Error retrieving User with email=" + email });
  });

})

app.post("/user",  (request, response) => {

 const hashedpass=  bcrypt.hash(request.body.password,8,async (err,hash)=>{
  // console.log(hash)

  const user= new usermodel();
  user.name=request.body.name,
  user.mobile=request.body.mobile,
  user.email=request.body.email;
  user.password=hash;
  user.role=request.body.role;
  user.status=request.body.status;
  
  
  try {
    await user.save();
    response.status(201);
    response.json({messsage: 'User Created successfully',name: request.body.name,useremail: request.body.email, status: 201})
   // response.send(food);
  } catch (error) {
    response.status(500).send(error);
  }
  //  console.log(request.body.email)
  // return hash;
  }) ;
  //console.log(hashedpass);
   // const food = new usermodel(request.body);
  
  });
  
  // ...

module.exports = app;
