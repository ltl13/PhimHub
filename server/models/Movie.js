const mongoose = require('mongoose');
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

  verticalPoster: {
    type: String,
    required: true,
  },

  horizontalPoster: {
    type: String,
    required: true,
  },

  trailer: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  directors: [
    {
      type: String,
    },
  ],

  productionCompanies: [
    {
      type: String,
    },
  ],

  writers: [
    {
      type: String,
    },
  ],

  actors: [
    {
      type: String,
    },
  ],

  movieTypes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'movie_types',
    },
  ],
});

module.exports = mongoose.model('movies', MovieSchema);
