// const dotenv = require('dotenv')
// const express = require("express");
// const connectDB = require("./config/db.js");
// const cors = require("cors");
// const path = require("path")

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path'
import authRoutes from './routes/auth.route.js'
import workflowRoutes from './routes/workflow.route.js'
import connectDB from './config/db.js'

const app = express();
dotenv.config()
const __dirname = path.resolve()
connectDB();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workflow", workflowRoutes);

const PORT = process.env.PORT || 5000;
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req,res) =>{
        res.sendFile(path.join(__dirname,"../frontend", "dist", "index.html"))
    })
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
