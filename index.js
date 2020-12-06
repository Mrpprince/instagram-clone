const express = require('express');
const mongoose =require("mongoose");
const {MONGOURI}=require("./key.js");
const app = express();
app.use(express.json());
require("./models/User");
app.use(require("./routes/auth.js"))



const PORT = 5353;

mongoose.connect(MONGOURI ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on("connected",()=>{
    console.log("MonGo is connected")
})

mongoose.connection.on("error",(err)=>{
    console.log(err);
})

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
}) 