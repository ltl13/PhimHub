const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FuncSchema = new Schema({
  funcName: {
    type: String,
    required: true,
    unique: true,
  },

  displayName: {
    type: String,
    required: true,
    unique: true,
  },

  staffTypes: [
    {
      type: Schema.Types.ObjectId,
      ref: "staff_types",
    },
  ],
});

module.exports = mongoose.model("funcs", FuncSchema);
