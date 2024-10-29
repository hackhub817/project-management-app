const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getFilteredTasks,
  AssignUser,
} = require("../controller/TaskController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/create", auth, createTask);
router.get("/getall", auth, getTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.put("/:id/status", auth, updateTaskStatus);
router.get("/filtertasks", auth, getFilteredTasks);
router.patch("/:id/assign", auth, AssignUser);

module.exports = router;
