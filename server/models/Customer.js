const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  customerType: {
    type: Schema.Types.ObjectId,
    ref: "CustomerTypes",
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "Accounts",
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sex: {
    type: Number,
    requried: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Customers", CustomerSchema);
