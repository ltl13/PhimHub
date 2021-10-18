const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductionCompanySchema = new Schema({
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

module.exports = mongoose.model("production_companies", ProductionCompanySchema);
