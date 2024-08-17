const mongoose = require("mongoose");
const SubSection = require("./SubSection");

const section = new mongoose.Schema({
  sctionName: {
    type: String,
  },
  SubSection: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "SubSection",
  },
});


module.exports = mongoose.model("Section", section);