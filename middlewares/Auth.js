const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


exports.auth = async (req, res, next) => { 
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized access Token missing" });
        }
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }catch(err){
            console.log("Failed to authenticate user", err);
            return res.status(401).json({ success: false, message: "Unauthorized access Token missing" });
        }
        next();
    }catch(err){
        console.log("Failed to authenticate user", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }
        
        }catch(err){
        console.log("User role cannot be verfied", err);
        return res.status(500).json({ success: false, message: err.message });
        }
}

exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }
        
        }catch(err){
        console.log("User role cannot be verfied", err);
        return res.status(500).json({ success: false, message: err.message });
        }
}

exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }
        
        }catch(err){
        console.log("User role cannot be verfied", err);
        return res.status(500).json({ success: false, message: err.message });
        }
}