const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
    unique: true,
  },

  funcs: [
    {
      type: Schema.Types.ObjectId,
      ref: "funcs",
    },
  ],
});

module.exports = mongoose.model("staff_types", StaffTypeSchema);
