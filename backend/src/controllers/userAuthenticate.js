// day2

const redisClient = require("../config/redis")
const User = require("../models/users")
const validate = require('../utils/validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//this registers the user
const register =async (req,res) =>{

    try{

        validate(req.body);
       const {firstName, emailId, password} = req.body; // destructuring req.body.firstName to firstName, same for others

       req.body.password = await bcrypt.hash(password,10);
       req.body.role = 'user'  // everyone will be registered as user
    
       const user = await User.create(req.body);   // adds req.body to database

       const token = jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60})

       res.cookie('token',token,{maxAge:60*60*1000}); // maxAge is in milliseconds

       res.status(201).send("User registered succesfully"); 
       

    }
    catch(err){
        res.status(400).send("Error: "+ err);
    }
}

const login = async (req,res)=>{
    
    try{
         
        const {emailId,password} =  req.body;


        // notice that we throw same error in both condition, we don't wanna let a random person know if they've got the right email or password
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId})  // search the "user" collection to find where this email is

        const match = await bcrypt.compare(password, user.password);

        // if we don't add await before compare, it returns a promise. In Js a promise is an object and all objects are truthy
        // so if condition below returns false always and it will let even wrong passwords log in

        if(!match)
            throw new Error("Invalid Credentials");

       const token = jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60})
       res.cookie('token',token,{maxAge:60*60*1000});
       res.status(200).send("Logged In Succesfully");
    }
    catch(err){
       res.status(401).send("Error: "+err);
    }
}

const logout = async(req,res)=>{
    try{
        
      const {token} = req.cookies;  

      const paylaod = jwt.decode(token);

      await redisClient.set(`token:${token}`,`Blocked`);
      await redisClient.expireAt(`token:${token}`,paylaod.exp);

     // validate the token
     // add token in redis blocklist

     res.cookie("token",null,{expires: new Date(Date.now())})
     res.send("Logged out succesfully");
     
    }
    catch(err){
    res.status(503).send("Error: "+err);
    }
}

const adminRegister = async (req,res)=>{
    try{
         
         validate(req.body);
       const {firstName, emailId, password} = req.body;

       req.body.password = await bcrypt.hash(password,10);
       
    
       const user = await User.create(req.body);

       const token = jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60})

       res.cookie('token',token,{maxAge:60*60*1000}); // maxAge is in milliseconds

       res.status(201).send("Admin registered succesfully"); 

    }
    catch(err){
      res.status(503).send("Error: "+err);
    }
}

module.exports = {register,login,logout,adminRegister};

