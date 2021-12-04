const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  token: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },

  sex: {
    type: Number,
    required: true,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },

  status: {
    type: Boolean,
    required: true,
    default: true,
  },

  avatar: {
    type: String,
    default: '',
  },

  createAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model('customers', CustomerSchema);
