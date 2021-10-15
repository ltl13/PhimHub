const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
  },

  inMovies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movies",
    },
  ],
});

module.exports = mongoose.model("Actors", ActorSchema);
