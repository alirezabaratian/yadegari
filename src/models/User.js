const mongoose = require("mongoose");
const memoSchema = require("./Memo").schema;

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        name: String,
        memos: [memoSchema],
    },
    { timestamps: true, versionKey: false }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
