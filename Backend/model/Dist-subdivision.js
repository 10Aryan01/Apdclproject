const mongoose = require("mongoose");
const subSchema = mongoose.Schema(
  {
    District: {
      type: String,
    },
    Subdivision: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Dist = mongoose.model("districtTable", subSchema);
module.exports = Dist;
