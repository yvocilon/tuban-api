"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    lane: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
exports.TaskModel = mongoose.model("task", TaskSchema);
