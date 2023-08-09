const asyncHandler = require("express-async-handler");
const APDCLuser = require("../model/usermodel");
const generateToken = require("../Config/token");
const counter = require("../model/counter");
const { assignRef } = require("@chakra-ui/react");
const IssueSchema = require("../model/issueModel");

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, phone_Number, Address, Aadhar_Number } = req.body;

  if (!name || !phone_Number || !Address || !Aadhar_Number) {
    res.status(400);
    throw new Error("Please Insert all the fields");
  }

  const userExits = await APDCLuser.findOne({ Aadhar_Number });

  if (userExits) {
    res.status(400);
    throw new Error("User allready Exits");
  }

  let cd = await counter.findOneAndUpdate(
    { id: "autoval" },
    { $inc: { seq: 1 } },
    { new: true }
  );
  if (cd === null) {
    const newval = new counter({ id: "autoval", seq: 200710007000 });
    await newval.save();
    seqID = 200710007000;
  } else {
    seqID = cd.seq;
  }

  const user = await APDCLuser.create({
    CustomerNo: seqID,
    name,
    phone_Number,
    Address,
    Aadhar_Number,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      CustomerNo: user.CustomerNo,
      name: user.name,
      phone_Number: user.phone_Number,
      Address: user.Address,
      Aadhar_Number: user.Aadhar_Number,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User Not found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { phone_Number } = req.body;
  const checkuser = await APDCLuser.findOne({ phone_Number });
  console.log(checkuser);
  let is_UserExits = checkuser;
  // let is_present = await checkuser.matchPassword(phone_Number);
  // console.log(is_present);

  if (is_UserExits !== null) {
    res.json({
      __id: checkuser._id,
      name: checkuser.name,
      phone_Number: checkuser.phone_Number,
      Address: checkuser.Address,
      Aadhar_Number: checkuser.Aadhar_Number,
      token: generateToken(checkuser._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const checkifissue = asyncHandler(async (req, res) => {
  // const keyword = req.query.District;
  // const keyword1 = req.query.Subdivision;
  const Ph_no = req.query.Phone;
  // const myissue = req.query.Issue;
  const chkdept = req.query.Department_id;
  // const alluserissues = await counter.find({ District: keyword, Subdivision: keyword1 }).sort("-createdAt");
  const Deptandphone = await IssueSchema.find({
    Phone: Ph_no,
    Department_id: chkdept,
  }).sort("-createdAt");
  res.send(Deptandphone);
});

const getissue = asyncHandler(async (req, res) => {
  const Dis = req.query.District;
  const Subdiv = req.query.Subdivision;
  const dept = req.query.Department_id;

  console.log(Dis, Subdiv, dept);
  const allissues = await IssueSchema.find({
    District: Dis,
    Subdivision: Subdiv,
    Department_id: dept,
  }).sort("-createdAt");

  res.send(allissues);
  // console.log(allissues);
});

const mySchema = require("../model/Dist-subdivision");
const getsub_div = asyncHandler(async (req, res) => {
  const { District } = req.query;
  if (!District) {
    return res.status(400).json({ error: "District parameter is required" });
  }
  try {
    const projection = { Subdivision: 1, _id: 0 };
    const subdivisions = await mySchema.find({ District }).select(projection);
    if (subdivisions.length === 0) {
      return res
        .status(404)
        .json({ error: "No subdivisions found for the selected district" });
    }
    res.status(200).json({
      subdivisions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to fetch subdivisions from the database" });
  }
});


module.exports = { registerUser, authUser, checkifissue, getissue, getsub_div };
