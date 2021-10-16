const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("MovieTypes", MovieTypeSchema);
