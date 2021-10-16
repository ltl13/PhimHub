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
});

module.exports = mongoose.model("Actors", ActorSchema);
