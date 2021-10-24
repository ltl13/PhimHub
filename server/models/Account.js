const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isStaff: {
    type: Boolean,
    required: true,
  },

  token: {
    type: String,
  },

  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("accounts", AccountSchema);
