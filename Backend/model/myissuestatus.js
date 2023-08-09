const mongoose = require("mongoose");

const myissueStatus=mongoose.Schema({

    issue_id:{
        type:String,
    },
    CustomerNo:{
        type:String,
        default:false,
    },
    In_Progress:{
        type:Boolean,
        default:false,
    },
    Done:{
        type:Boolean
    }
});

const MyissueStat=mongoose.model("IssueStatus",myissueStatus);
module.exports=MyissueStat;