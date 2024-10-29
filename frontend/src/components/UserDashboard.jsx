import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/project/getAllprojects",
          {
            withCredentials: true,
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [projects]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/project/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(response.data.message || "Project deleted successfully!");

      console.log(response.data.message);
    } catch (error) {
      toast.error(error.response?.data.message || "Error deleting project.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Project Management</h1>
        <button
          className="mb-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          onClick={() => navigate("/create-project")}
        >
          + Add New Project
        </button>

        <div className="grid gap-6 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {project.title}
              </h2>
              <p className="text-gray-600 mt-2">{project.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Created on: {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => navigate(`/update-project/${project._id}`)}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/fetch-tasks/${project._id}`)}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Manage Tasks
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
