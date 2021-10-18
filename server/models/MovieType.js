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
      ref: "movies",
    },
  ],
});

module.exports = mongoose.model("movie_types", MovieTypeSchema);
