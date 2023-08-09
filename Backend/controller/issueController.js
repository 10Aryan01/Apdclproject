const asyncHandler = require("express-async-handler");
const IssueSchema = require("../model/issueModel");
const Schema = require("../model/counter");
const APDCLuser = require("../model/usermodel");
const Pole = require("../model/polemodel");
const Dtr = require("../model/DtrModel");

let Dept;
const setIssue = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { District, Subdivision, Address, Phone, Issue, Image } = req.body;
  if (!District || !Subdivision || !Address || !Phone || !Issue) {
    res.status(400);
    throw new Error("Please add a new text field");
  }
  // const isExist = await IssueSchema.findOne({ Issue });
  // const isdept = await IssueSchema.findOne({ Department_id });
  // const doesExist = await IssueSchema.findOne({ Phone }); //input phone number
  const projection = { CustomerNo: 1, _id: 0 };
  const phone_Number = Phone;
  const result = await APDCLuser.findOne({ phone_Number }).select(projection);
  console.log(result.CustomerNo);
  console.log(Issue);

  const projection1 = { pole_no: 1, _id: 0 };
  const CustomerNo = result.CustomerNo;
  console.log("This is the Cusno " + result.CustomerNo);
  const poleResult = await Pole.findOne({ CustomerNo }).select(projection1);
  console.log(poleResult.pole_no);

  const projection2 = { dtr_no: 1, _id: 0 };
  const pole_no = poleResult.pole_no;
  console.log(pole_no);
  const result1 = await Dtr.findOne({ pole_no }).select(projection2);
  console.log(result1.dtr_no);

  // if (isExist && doesExist) {
  //   res.status(400);
  //   throw new Error("Issue already Exists for this User.");
  // }
  if (result === null) {
    res.status(400);
    throw new Error("Customer id not found");
  }
  if (Issue === "Transformer") {
    Dept = "D1";
  } else if (Issue === "Pole") {
    Dept = "D2";
  } else {
    Dept = "others";
  }

  const issue = await IssueSchema.create({
    CustomerNo: result.CustomerNo,
    District,
    Subdivision,
    Address,
    Phone,
    Department_id: Dept,
    Issue,
    dtr_no: result1.dtr_no,
    Image,
    status: {
      inProgress: false,
      done: false,
    },
  });
  if (issue) {
    res.status(200).json({
      _id: issue._id,
      CustomerNo: issue.CustomerNo,
      District: issue.District,
      Subdivision: issue.Subdivision,
      Address: issue.Address,
      Phone: issue.Phone,
      Department_id: issue.Department_id,
      Issue: issue.Issue,
      dtr_no: issue.dtr_no,
      Image: issue.Image,
      status: {
        inProgress: issue.status.inProgress,
        done: issue.status.done,
      },
    });
  } else {
    res.status(400);
    throw new Error("Issue not registered");
  }
  // console.log(issue);
  // console.log(issue.dtr_no);
});

const MyissueStat = require("../model/myissuestatus");
const setIssueStat = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { id, progress} = req.body;

  const updateprogress = await IssueSchema.findByIdAndUpdate(
    id,
    {
      "status.inProgress": progress,
    },
    { new: true }
  );
  if (updateprogress) {
    res.status(200).json({
      message: "Issue status updated successfully.",
      updateprogress,
    });
  } else {
    res.status(404);
    throw new Error("Issue not found.");
  }
});
const setIssueStatdone = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { id,done } = req.body;

  const updatedone = await IssueSchema.findByIdAndUpdate(
    id,
    {
      "status.done": done,
    },
    { new: true }
  );
  if (updatedone) {
    res.status(200).json({
      message: "Issue status updated successfully.",
      done,
    });
  } else {
    res.status(404);
    throw new Error("Issue not found.");
  }
});

module.exports = { setIssue, setIssueStat,setIssueStatdone };
