const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
  },
  
  movies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movies",
    },
  ],
});

module.exports = mongoose.model("MovieTypes", MovieTypeSchema);
