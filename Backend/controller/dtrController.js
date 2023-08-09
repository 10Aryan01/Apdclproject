const asyncHandler = require('express-async-handler')
const Dtr = require('../model/DtrModel');

const setdtr = asyncHandler(async(req, res) => {
    console.log(req.body);
    const { pole_no, dtr_no } = req.body
    
    const issue = await Dtr.create({
        pole_no,
        dtr_no
    })
    if (issue) {
        res.status(200).json({
            _id: issue._id,
            pole_no: issue.pole_no,
            dtr_no: issue.dtr_no,
        })
    } else {
        res.status(400)
        throw new Error('Issue not registered')
    }
})

module.exports = {setdtr}
