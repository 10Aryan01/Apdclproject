const asyncHandler = require("express-async-handler");
const Pole = require("../model/polemodel");

const setpole = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { pole_no, CustomerNo } = req.body;
  // if (!pole_no || !CustomerNo) {
  //     res.status(400)
  //     throw new Error('Please add a new text field')
  // }

  const issue = await Pole.create({
    pole_no,
    CustomerNo,
  });
  if (issue) {
    res.status(200).json({
      _id: issue._id,
      pole_no: issue.pole_no,
      CustomerNo: issue.CustomerNo,
    });
  } else {
    res.status(400);
    throw new Error("Issue not registered");
  }
});

module.exports = { setpole };
