const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    const { subSection, description, timeDuration, SectionId } = req.body;
    const video = req.files.videoFile;

    if (!subSection || !SectionId || !timeDuration || !description || !video) {
      return req.status(401).json({
        success: true,
        message: "All fields are required",
      });
    }
    const secureLink = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    const newSubSection = await SubSection.create({
      title: subSection,
      description: description,
      timeDuration: timeDuration,
      videoUrl: secureLink.secure_url,
    });
    const updatedSection = await Section.findByIdAndUpdate(SectionId, { $push:{SubSection: newSubSection }},{new:true}).populate('SubSection');
    return req.status(200).json({
      success:true,
      message:"Successfull",
      updatedSection
    })
  } catch (err) {
    return req.status(401).json({
      success:false,
      message:"Something went wrong while creating a subsection."
    })
  }
};

exports.updateSubSection =async(req, res) =>{
  const { subSection, description, timeDuration, SectionId } = req.body;
  const video = req.files.videoFile;

  try{
    if (!subSection || !SectionId || !timeDuration || !description || !video) {
      return req.status(401).json({
        success: true,
        message: "All fields are required",
      });
    }
    const secureLink = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    const updateSubSection = await SubSection.findByIdAndUpdate(SectionId,{
      title: subSection,
      description: description,
      timeDuration: timeDuration,
      videoUrl: secureLink.secure_url,
    },{new:true});
    return req.status(200).json({
      success:true,
      message:Success,
      updateSubSection
    })
  }catch(err){
    return req.status(400).json({
      success:true,
      message:Success,
      updateSubSection
    })
                  
  }
  
}

exports.deleteSubSection = async(req,res) =>{
  try{
    const{subSectionId} = req.body
    await SubSection.findByIdAndDelete(subSectionId)
    return req.status(200).json({
      success:true,
      message:"Successfull"
    })

  }catch(err){
    return req.status(400).json({
      success:true,
      message:"Something went wrong while deleation"
    })
  }
  
}
