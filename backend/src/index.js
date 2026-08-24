const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');



app.use(express.json()); // req.body me jo data json format me ayega usko object me convert karna
app.use(cookieParser());

app.use('/user',authRouter);

const InitializeConnection = async ()=>{

    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log('DB Connected');

        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port: "+process.env.PORT);
        })
        }

    catch(err){
         console.log("Error: "+err);
    }
}

InitializeConnection();


