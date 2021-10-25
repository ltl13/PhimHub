const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },

  functions: [
    {
      type: Schema.Types.ObjectId,
      ref: "functions",
    },
  ],
});

module.exports = mongoose.model("roles", RoleSchema);
