const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    const { section, courseId } = req.body;
    if (!section || !courseId) {
      return req.status(401).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const newSection = await Section.create({ sctionName: section });
    const newCourse = await Course.findOneAndUpdate(
      courseId,
      { $push: { CourseContent: newSection._id } },
      { new: true }
    )
      .populate("Section")
      .populate("SubSection")
      .exec();
    return req.status(200).json({
      success: true,
      message: "Successful",
      newCourse,
    });
  } catch (err) {
    return req.status(401).json({
      success: false,
      message: "Somthing went wrong will creating a Section",
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { section, sectionId } = req.body;
    if (!section || !sectionId) {
      return req.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }
    const newSection = await Section.findByIdAndUpdate(sectionId, section, {
      new: true,
    });
    return req.status(200).json({
      success: true,
      message: "Successfull",
      newSection,
    });
  } catch (err) {
    return req.status(401).json({
      success: false,
      message: "Failed to update Section",
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const {SectionId} = req.params
    if(!SectionId){
        return req.status(401).json({
            success:false,
            message:"All fields are required"
        })
    }
    
    await Section.findByIdAndDelete(SectionId)
    return req.status(401).json({
        success:true,
        message:"Successful"
    })
  } catch (err) {}
};
