const { default: mongoose } = require("mongoose");
const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res
        .status(401)
        .json({ success: false, message: "All fields required" });
    }
    const tagExist = await Category.findOne({ name: name });
    if (tagExist) {
      return res
        .status(401)
        .json({ success: false, message: "Tag already exists" });
    }
    const tagPayLoad = { name: name, description: description };
    const newTag = await Category.create(tagPayLoad);

    return (
      res.status(200),
      json({ success: true, message: "Tag created successfully", data: newTag })
    );
  } catch (err) {
    console.log("Failed to create Category", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//AllShowCategory

exports.showAllCategories = async (req, res) => {
  try {
    const Category = await Category.find(
      {},
      { name: true, description: false }
    );
    return res.status(200).json({
      success: true,
      message: "All Category returned sucessfully ",
      data: Category,
    });
  } catch (err) {
    console.log("Failed to show Category", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryID } = req.body;

    const CategoryCourse = await Category.findById(categoryID)
      .populate("courses")
      .exec();
    if (!categoryID) {
      return req.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
    const differentCategories = await Category.find({
      _id: { $ne: categoryID },
    })
      .populate("courses")
      .exec();

    const popularCourse = await Category.aggregate([ { $match: new mongoose.Types.ObjectId(categoryID) },
      {
        $group:{
          _id:"courseId",
          number:{
            $count:"$courses"
          }
        }
      }]
     
    );
    return req.status(200).json({
      success:true,
      data:{
        CategoryCourse,
        differentCategories,
        popularCourse
      }
    })
  } catch (err) {
    return req.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
