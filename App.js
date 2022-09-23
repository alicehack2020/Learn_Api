import express from "express";
import dotenv from "dotenv"
dotenv.config()

import cors from "cors";
import connectDb from "./config/connectdb.js"

import userRoutes from "./routes/userRoutes.js "

const app=express()
const port=process.env.PORT;
const database_url=process.env.DATABASE_URL;
//cores policy
app.use(cors())

//database connection
connectDb(database_url)

//json
app.use(express.json())

//load routes
app.use('/api/user',userRoutes)

 app.listen(port,()=>{
    console.log("server started")
 })

 