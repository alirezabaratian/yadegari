const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema(
    {
        author: String,
        date: String,
        message: String,
    },
    { timestamps: true, versionKey: false }
);

const Memo = new mongoose.model("Memo", memoSchema);

module.exports = Memo;
