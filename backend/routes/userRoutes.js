const express = require("express");
const User = require("../models/User");
const jwt =require("jsonwebtoken");
const  {protect, admin} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });
    await user.save();

    // ✅ RESPONSE IS MUST
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


router.post("/login",async(req,res)=>{
  const {email,password}=req.body;

  try{
    let user =await User.findOne({email});
    
    if(!user)return res.status(400).json({message:"Invalid Credentials"})
      const isMatch = await user.matchPassword(password)

    if(!isMatch)
      return res.status(400).json({message:"Invalid Credentials"})

     const payload={user:{id:user._id,role:user.role}};

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {expiresIn:"40h"},
      (err, token)=>{
        if(err) throw err;
        res.json({
          user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
          },
          token
        })
      }
    )

  

  }catch(err){
    console.error(err);
    res.status(500).send("Server Error")

  }
});

router.get("/profile", protect, admin, async (req,res)=>{
  res.json(req.user)
})


module.exports= router