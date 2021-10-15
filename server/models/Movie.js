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
      ref: "Actors",
    },
  ],

  directors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Directors",
    },
  ],

  productionCompanies: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductionCompanies",
    },
  ],

  writers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Writers",
    },
  ],

  movieTypes: [
    {
      type: Schema.Types.ObjectId,
      ref: "MovieTypes",
    },
  ],

  listTickets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tickets",
    },
  ],

  movieCalendars: [
    {
      type: Schema.Types.ObjectId,
      ref: "MovieCalendars",
    },
  ],
});

module.exports = mongoose.model("Movies", MovieSchema);
