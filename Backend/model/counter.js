const mongoose = require('mongoose')

const insIssue = mongoose.Schema({
    id: {
        type: String,
    },
    seq: {
        type: Number,
    },
})

const Schema = mongoose.model(" AllIssue ", insIssue)
module.exports=Schema;