const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course")

exports.createRating = async (req, res) => {
  const { courseId,rating, review } = req.body;
  const userId = req.user.id;
  if (!rating || !review || !courseId) {
    return req.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }
  const newRating = await RatingAndReview.create({
    user: userId,
    rating: rating,
    review: review,
  },{new:true});
  const updateCourse = await Course.findOneAndUpdate({_id:courseId},{$push:{ratingAndReview:newRating._id}}).populate("RatingAndReview")
  return req.status(200).json({
    success:true,
    message:"Successful",
    newRating
  })
};

exports.getAllRating = async(req,res)=>{
    const {courseId} = req.body
    
    if(!courseId){
        return req.status(400).json({
            success:false,
            message:"All fields are required."
        })
    }
    const courseRating = await Course.findOne({_id:courseId});
    if(!courseRating){
        return req.status(400).json({
            success:false,
            message:"Course not found."
        })
    }
    return req.status(200).json({
        success:true,
        message:"Successfull"
    })
}