const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
  staffType: { type: Schema.Types.ObjectId, ref: "staffTypes" },
  account: { type: Schema.Types.ObjectId, ref: "accounts" },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  identityNumber: { type: String, required: true, unique: true },
  sex: { type: Number, required: true },
  dateOfBirth: { type: Date, required: true },
  salary: { type: Number, required: true },
  status: { type: Boolean, required: true },
});

module.exports = mongoose.model("staffs", StaffSchema);
