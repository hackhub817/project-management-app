// ProjectDetails.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const FetchTasks = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-200 text-gray-700";
      case "In Process":
        return "bg-yellow-200 text-yellow-700";
      case "Done":
        return "bg-green-200 text-green-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axios.get(
          `http://localhost:5000/api/project/${id}`,
          { withCredentials: true }
        );
        setProject(projectResponse.data);

        const tasksResponse = await axios.get(
          `http://localhost:5000/api/task/getall/?projectId=${id}`,
          { withCredentials: true }
        );
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [id]);
  const onDeleteTask = async (id) => {
    console.log("del id", id);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/task/${id}`,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!project) return <p>Loading project details...</p>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center p-4 sm:p-8 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-800 mb-2">
          {project.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6 text-center max-w-2xl">
          {project.description}
        </p>
        <p className="text-sm text-gray-600 mb-6 sm:mb-8">
          Created on: {new Date(project.createdAt).toLocaleDateString()}
        </p>

        <button
          onClick={() => navigate(`/project/${project._id}/create-task`)}
          className="mb-6 sm:mb-8 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition"
        >
          + Create Task
        </button>

        {/* Display tasks in a two-column grid for larger screens */}
        <div className="w-full max-w-4xl bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-indigo-700">
            Tasks
          </h2>
          {tasks.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 transition transform hover:-translate-y-1"
                >
                  <div className="flex flex-col h-full">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{task.description}</p>
                      <div className="text-sm text-gray-500 mb-2">
                        <span>
                          Start date:{" "}
                          {new Date(task.startDate).toLocaleDateString()}
                        </span>{" "}
                        |{" "}
                        <span>
                          Due date:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Assigned to:{" "}
                        <span className="font-semibold">
                          {task.assignedUser || "Unassigned"}
                        </span>
                      </p>
                      <div
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(
                          task.status
                        )}`}
                      >
                        Status: {task.status}
                      </div>
                      <p className="text-sm text-gray-500 mt-3">Remarks:</p>
                      <ul className="pl-4 list-disc text-gray-600">
                        {task.remarks.map((remark, index) => (
                          <li key={index} className="text-sm">
                            {remark.text} -{" "}
                            <span className="text-gray-400">
                              {new Date(remark.timestamp).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/update-task/${task._id}/?projectId=${id}`)
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/assign-task/${task._id}/?projectId=${id}`)
                        }
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => onDeleteTask(task._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No tasks available for this project.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default FetchTasks;
