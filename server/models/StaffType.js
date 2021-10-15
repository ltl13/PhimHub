const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffTypeSchema = new Schema({
  position: {
    type: String,
    required: true,
    unique: true,
  },

  staffs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Staffs",
    },
  ],
});

module.export = mongoose.model("StaffTypes", StaffTypeSchema);
