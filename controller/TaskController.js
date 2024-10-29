const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const mongoose = require("mongoose");

exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description, startDate, dueDate, status } =
      req.body;

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user.id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(req.user.id)
    ) {
      return res.status(400).json({ message: "Invalid Project ID or User ID" });
    }

    const newTask = new Task({
      projectId,
      title,
      description,
      startDate,
      dueDate,
      status,
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    console.log(projectId);

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    console.log("i", id);
    console.log("data", req.body);
    const task = await Task.findOneAndUpdate(
      { _id: id },
      {
        status,
        $push: {
          remarks: remarks,
        },
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
};

exports.getFilteredTasks = async (req, res) => {
  try {
    const { status, projectId } = req.query;
    const userId = req.user?.id;
    const filter = { projectId: projectId };

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required for this request" });
    }

    if (status) filter.status = status;

    const tasks = await Task.find(filter);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving filtered tasks:", error);
    res.status(500).json({ message: "Error retrieving filtered tasks", error });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, remark } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = newStatus;
    task.remarks.push({
      status: newStatus,
      text: remark,
      timestamp: new Date(),
    });

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task status", error });
  }
};

exports.AssignUser = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { assignedUser: req.body.assignedUser },
    { new: true }
  );
  res.send(task);
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
