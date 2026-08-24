
For debugging, use this type of format

// const InitializeConnection = async ()=>{
//     try {
//         console.log("⏳ Attempting MongoDB connection...");
//         await main();
//         console.log("✅ MongoDB connected successfully!");

//         console.log("⏳ Attempting Redis connection...");
//         await redisClient.connect();
//         console.log("✅ Redis connected successfully!");

//         app.listen(process.env.PORT, ()=>{
//             console.log("🚀 Server listening at port: " + process.env.PORT);
//         })
//     } catch(err){
//          console.log("❌ Connection Error caught in index.js: ", err);
//     }
// }