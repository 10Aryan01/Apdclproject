const asyncHandler = require("express-async-handler");
const DeleteIssSchema = require("../model/Deletedissue");
const IssueSchema = require("../model/issueModel");

const setdeleteIssue = asyncHandler(async (req, res) => {
  console.log("tis is body " + req.body);

  const {
    CustomerNo,
    District,
    Subdivision,
    Address,
    Phone,
    Department_id,
    Issue,
    dtr_no,
    Image,
    inProgress,
    done,
  } = req.body;
  console.log(req.body);
  if (
    !CustomerNo ||
    !District ||
    !Subdivision ||
    !Address ||
    !Phone ||
    !Department_id ||
    !Issue ||
    !dtr_no ||
    !Image ||
    !inProgress ||
    !done
  ) {
    res.status(400);
    throw new Error("Please add a new text field");
  }

  const issue = await DeleteIssSchema.create({
    CustomerNo: CustomerNo,
    District: District,
    Subdivision: Subdivision,
    Address: Address,
    Phone: Phone,
    Department_id: Department_id,
    Issue: Issue,
    dtr_no: dtr_no,
    Image: Image,
    status: {
      inProgress: inProgress,
      done: done,
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

  //Now Deleting

  const projection = { _id: 0 };
  const query = { Department_id: Department_id, CustomerNo: CustomerNo };
  const result = await IssueSchema.findOne(query).select(projection);

  if (result) {
    await IssueSchema.deleteOne(query);
    console.log('Document deleted successfully!');
  } else {
    console.log('Document not found. Nothing to delete.');
  }

});

module.exports = { setdeleteIssue };
