const Course = require("../models/Course");
const Profile = require("../models/Profile")
const User = require("../models/User")

exports.updateProfile = async (req,res)=>{
    try{
        const {gender,dateofBirth,about,contactNumber} = req.body;        
        if(gender||dateofBirth||about||contactNumber){
            return req.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }
        const userId = req.user.id
        const user = await User.findById(userId)
    
        const profileId = user.additionalDetails
        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateofBirth = dateofBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber
        await profileDetails.save()
        
        return req.status(200).json({
            success:true,
            message:"Successfull",
            profileDetails,
            
        })
    }catch(err){
        return req.status(401).json({
            success:false,
            message:"Something went wrong while creating profile."
        })

    }
} 

exports.deleteAccount = async (req,res)=>{
    try{
        const id = req.user.id;
        const userDetails = await User.findById(id)

        if(!userDetails){
            return req.status(404 ).json({
                success:false,
                message:"User not found"
            })
        }
        const profileId = userDetails.additionalDetails

        await Profile.findByIdAndDelete(profileId)
        await User.findByIdAndDelete(id)
        
        return res.status(200).json({
            success:true,
            message:"Successfull"
        })

    }catch(err){
        return req.status(400).json({
            success:false,
            message:"Failed while deleting Account"
        })

    }
}

exports.getAllUserDetails = async (req,res)=>{
    try{
        const id = req.user.id

        const userDetails = await User.findById(id).populate('additionalDetails').exec()
    
        
    
        return req.status(200).json({
            success:true,
            message:"Successfull",
            userDetails
        })
    }catch(err){
        return req.status(400).json({
            success:true,
            message:"Something went wrong while fetching profile details"
        })
    }
}