const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require("../key");
const requireLogin = require("../middleWare/requireLogin")


router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello User");
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please fill all required" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "Already exist this email " });
            }

            bcrypt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email,
                        name,
                        password: hashedPassword
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "Saved Successfully" })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })

        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add an email " })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "You provide an Invalid  email or password " })
            }
            bcrypt.compare(password, savedUser.password)
            .then((doMatch=>{
                if (doMatch) {
                    // res.send({ message: "Successfully singed in" })
                    const token=jwt.sign({_id:savedUser._id},JWT_SECRET);
                    res.json({token});
                }
                else {
                    return res.status(422).json({ error: "You provide an Invalid  email or password " })
                }
            }))
           
        })
        .catch(err => {
            console.log(err);
        })
})


module.exports = router