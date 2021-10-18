const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
  name: {
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

module.exports = mongoose.model("directors", DirectorSchema);
