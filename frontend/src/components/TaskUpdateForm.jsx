import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const UpdateTaskForm = () => {
  const [status, setStatus] = useState("Not Started");
  const [remarkText, setRemarkText] = useState("");
  const [error, setError] = useState(null);
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const project = queryParams.get("projectId");
  console.log("Task ID:", id, project);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/task/${id}`,
        {
          status,
          remarks: [{ text: remarkText }],
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Task updated successfully!");
        navigate(`/fetch-tasks/${project}`);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      setError("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-green-50 to-green-100 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-4">
        Update Task
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
      >
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-gray-700 font-semibold mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-200"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Process">In Process</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="remarkText"
            className="block text-gray-700 font-semibold mb-2"
          >
            Remark
          </label>
          <textarea
            id="remarkText"
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            placeholder="Enter any remarks here..."
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-200 resize-none"
            rows={4}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default UpdateTaskForm;
