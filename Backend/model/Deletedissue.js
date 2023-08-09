const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");

const deletedissues = mongoose.Schema(
  {
    CustomerNo: {
      type: Number,
    },
    District: {
      type: String,
      //required: [true, 'Please add a text value'],
    },
    Subdivision: {
      type: String,
    },
    Address: {
      type: String,
    },
    Phone: {
      type: Number,
    },
    Department_id: {
      type: String,
    },
    Issue: {
      type: String,
    },
    dtr_no: {
      type: Number,
    },
    Image: {
      type: String,
      //default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      default: "NUll",
    },
    status:{
      inProgress:
      {
        type:Boolean,
        default:false,
      },
      done:{
        type:Boolean,
        default:false,
      }
    }
  },
  {
    timestamps: true,
  }
);

const DeleteIssSchema = mongoose.model("deletedissues", deletedissues);
module.exports = DeleteIssSchema;
