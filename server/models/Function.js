const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FunctionSchema = new Schema({
  functionName: {
    type: String,
    required: true,
    unique: true,
  },

  displayName: {
    type: String,
    required: true,
    unique: true,
  },

  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "roles",
    },
  ],
});

module.exports = mongoose.model("functions", FunctionSchema);
