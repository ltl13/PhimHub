const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
  staffType: {
    type: Schema.Types.ObjectId,
    ref: "staff_types",
  },

  account: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
  },

  username: {
    type: String,
    required: true,
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

  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("staffs", StaffSchema);
