require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");
import path from 'path'

const app = express();
const __dirname = path.resolve()
connectDB();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());

app.use("/api/auth", require("./routes/auth.route.js"));
app.use("/api/workflow",require("./routes/workflow.route.js"));

const PORT = process.env.PORT || 5000;
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req,res) =>{
        res.sendFile(path.join(__dirname,"../frontend", "dist", "index.html"))
    })
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
