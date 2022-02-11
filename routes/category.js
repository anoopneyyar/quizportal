const express = require("express");
const categorymodel = require("../models/category");
const quizmodel= require("../models/quiz");
const bcrypt = require('bcrypt');
const app = express();
const Jwt= require('jsonwebtoken');
var slugify = require('slugify')
const { users } = require("../../node2/app/models");
const { json } = require("express");

function auth (request,response,next){
   
    
  if(!request.header('Authorization'))
  {
    response.status(400).send({message:'Not Authorized for this operation !',status:400});
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
//Category Module codes
//Creatre category
app.post('/addcategory',auth,async (req,res)=>{
   if(req.role==1)
   {
  const category= new categorymodel();
  category.cat_name=req.body.cat_name;
  category.parent_id=req.body.parent_id;
  category.image_path=req.body.image_path;
  category.cat_slug=slugify(category.cat_name);

  category.status=req.body.status;
  
  
  try {
    await category.save();
    res.status(201);
    res.json({messsage: 'Category Created successfully',category:req.body.cat_name, status: 201})
   // response.send(food);
  } catch (error) {
    res.status(500).send(error);
  }
}
else
{
    res.status(400).send({message:'Only admins are allowed to do this operation !'});
}


});
//End create category
//Get all categories
app.get('/allcategories',async (req,res)=>{
    try
    {
    const categories= await categorymodel.find({status:true},(err,doc)=>{
        res.status(200)
        res.send(doc);
    }).clone();
}
catch(e)
{
    res.status(400).send({status:400,message:'Error detected !'})
}
})

// End get all categories
// Get all parent categories
app.get('/all-base-categories',async (req,res)=>{
    try
    {
    const categories= await categorymodel.find({status:true,parent_id:0},(err,doc)=>{
        res.status(200)
        res.send(doc);
    }).clone();
}
catch(e)
{
    res.status(400).send({status:400,message:'Error detected !'})
}
})

app.delete('/delete/:id',auth,async (req,res)=>{
  if(req.role==1)
  {
  if(req.params.id){
  const id=req.params.id;
  try{
   
  await categorymodel.deleteOne({ _id: id });
  res.status(200).send({status:200,message:'Category deletion successfull !'})
    
  }
  catch(e)
  {
   return res.status(400).send({message:'Something went wrong'});
  }
 // console.log(id);
  }
  else
  {
    res.status(400).send({status:400,message:'Category id should be provided !'})
  }
  }
  else{
    res.status(400).send({status:400,message:'Only admin is allowed to do this operation !'});
  }
})
//End Get all parent categories
//Get sub-category of a parent category

app.get('/sub-category',async (req,res)=>{
    const par_cat_id= req.body.parent_id;
    try
    {
    const categories= await categorymodel.find({status:true,parent_id:par_cat_id},(err,doc)=>{
        res.status(200)
        res.send(doc);
    }).clone();
}
catch(e)
{
    res.status(400).send({status:400,message:'Error detected !'})
}

})

//End get sub-category
//End Category Module codes


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

  
  const users = await usermodel.find({}).select('name mobile email status -_id');

  try {
  
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
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
            const token= Jwt.sign({_id:id},"thisisasimplesecret")
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
  user.status=request.body.status
  
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