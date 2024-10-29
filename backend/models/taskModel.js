const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  dueDate: Date,
  status: {
    type: String,
    enum: ["Not Started", "In Process", "Done"],
    default: "Not Started",
  },
  remarks: [
    {
      text: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  assignedUser: { type: mongoose.Schema.Types.String, ref: "User" },
});

module.exports = mongoose.model("Task", taskSchema);
