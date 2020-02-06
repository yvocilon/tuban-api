import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
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

export interface Task extends mongoose.Document {
  title: string;
  lane: string;
}

export const TaskModel = mongoose.model<Task>("task", TaskSchema);
