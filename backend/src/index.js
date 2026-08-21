const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db')
const cookieParser = require('cookie-parser')

app.use(express.json()); // req.body me jo data json format me ayega usko object me convert karna
app.use(cookieParser());

main()
.then(async ()=>{
app.listen(process.env.PORT,()=>{
    console.log("Listening to port :" + process.env.PORT);
})
})
.catch(err => console.log("Error Ocurred: " + err));
