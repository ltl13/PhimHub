const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffTypeSchema = new Schema({
  position: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("staff_types", StaffTypeSchema);
