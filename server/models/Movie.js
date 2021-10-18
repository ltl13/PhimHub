const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  premiereDate: {
    type: Date,
    required: true,
  },

  poster: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  actors: [
    {
      type: Schema.Types.ObjectId,
      ref: "actors",
    },
  ],

  directors: [
    {
      type: Schema.Types.ObjectId,
      ref: "directors",
    },
  ],

  productionCompanies: [
    {
      type: Schema.Types.ObjectId,
      ref: "production_companies",
    },
  ],

  writers: [
    {
      type: Schema.Types.ObjectId,
      ref: "writers",
    },
  ],

  movieTypes: [
    {
      type: Schema.Types.ObjectId,
      ref: "movie_types",
    },
  ],
});

module.exports = mongoose.model("movies", MovieSchema);
