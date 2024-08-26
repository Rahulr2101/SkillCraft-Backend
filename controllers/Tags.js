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

exports.allShowCategory = async (req, res) => {
  try {
    const Category = await Category.find({},{name:true,description:false});
    return res.status(200).json({ success: true, message:"All Category returned sucessfully ",data: Category });

  } catch (err) {
    console.log("Failed to show Category", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
