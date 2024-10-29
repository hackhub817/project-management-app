const express = require("express");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById,
} = require("../controller/ProjectController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/create", auth, createProject);
router.get("/getAllprojects", auth, getProjects);
router.put("/:id", auth, updateProject);
router.get("/:id", auth, getProjectById);
router.delete("/delete/:id", auth, deleteProject);

module.exports = router;
