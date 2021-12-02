const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
  staffType: {
    type: Schema.Types.ObjectId,
    ref: 'staff_types',
  },

  username: {
    type: String,
    required: true,
  },

  password: {
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

  phoneNumber: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  identityNumber: {
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

  salary: {
    type: Number,
    required: true,
  },

  avatar: {
    type: String,
  },

  status: {
    type: Boolean,
    required: true,
    default: true,
  },

  createAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model('staffs', StaffSchema);
