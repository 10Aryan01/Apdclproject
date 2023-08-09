const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    CustomerNo: {
      type: Number,
    },
    name: { type: String, require: true },
    phone_Number: { type: Number, require: true },
    Address: { type: String, require: true },
    Aadhar_Number: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (password) {
  if (password === this.password) {
    console.log(password);
    console.log(this.password);
    return true;
  }
};

const APDCLuser = mongoose.model("APDCLuser", userSchema);
module.exports = APDCLuser;
