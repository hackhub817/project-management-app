import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const FetchTasks = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
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

  const fetchProjectDetails = async () => {
    try {
      const projectResponse = await axios.get(
        `http://localhost:5000/api/project/${id}`,
        { withCredentials: true }
      );
      setProject(projectResponse.data);
      console.log(projectResponse.data);

      const tasksResponse = await axios.get(
        `http://localhost:5000/api/task/filtertasks/?projectId=${id}&status=${statusFilter}`,
        { withCredentials: true }
      );
      setTasks(tasksResponse.data);
      console.log(tasksResponse.data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id, statusFilter, project]);

  const onDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/task/${taskId}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchProjectDetails();
    } catch (error) {
      toast.error("Error deleting task: " + error.response.data.message);
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
        <p className="text-lg sm:text-xl text-gray-700 text-center max-w-3xl mb-6">
          Description- {project.description}
        </p>

        <button
          onClick={() => navigate(`/project/${project._id}/create-task`)}
          className=" px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition duration-200"
        >
          + Create Task
        </button>

        <div className="w-full max-w-6xl flex justify-between items-center mb-4">
          <div className="w-full md:w-1/4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Process">In Process</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="w-full max-w-6xl bg-white p-4 mt=b-3 sm:p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold p-2 text-center text-indigo-700">
            Tasks
          </h2>
          {tasks.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 transition transform hover:-translate-y-1"
                >
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl sm:text-xl font-bold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-base">
                      <span className="text-lg font-semibold">
                        Description :{" "}
                      </span>
                      {task.description}
                    </p>
                    <div className="text-base text-gray-500 mb-3">
                      <span className="text-lg font-semibold">
                        Start date:{" "}
                      </span>{" "}
                      {new Date(task.startDate).toLocaleDateString()}|{" "}
                      <span className="text-lg font-semibold">Due date: </span>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <p className="text-lg text-gray-500 mb-3">
                      Assigned to:{" "}
                      <span
                        className={`text-base font-semibold ${
                          task.assignedUser ? "text-red-700" : "text-gray-500"
                        }`}
                      >
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
                    <p className="text-lg font-bold text-gray-500 mt-3">
                      Remarks:
                    </p>
                    <ul className="pl-4 list-disc text-gray-600">
                      {task.remarks.map((remark, index) => (
                        <li key={index} className="text-base">
                          {remark.text} -{" "}
                          <span className="text-gray-400">
                            {new Date(remark.timestamp).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/update-task/${task._id}/?projectId=${id}`)
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/assign-task/${task._id}/?projectId=${id}`)
                        }
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 w-full sm:w-auto"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => onDeleteTask(task._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 mt-6">
              No tasks available for this project.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default FetchTasks;
