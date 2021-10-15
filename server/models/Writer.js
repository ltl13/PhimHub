const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WriterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  
  inMovies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movies",
    },
  ],
});

module.exports = mongoose.model("Writers", WriterSchema);
