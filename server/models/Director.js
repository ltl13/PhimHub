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
      ref: "Movies",
    },
  ],
});

module.exports = mongoose.model("Directors", DirectorSchema);
