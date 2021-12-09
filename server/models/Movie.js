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
  },

  horizontalPoster: {
    type: String,
  },

  trailer: {
    type: String,
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

  status: {
    type: Boolean,
    required: true,
    default: true,
  },

  deletedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('movies', MovieSchema);
