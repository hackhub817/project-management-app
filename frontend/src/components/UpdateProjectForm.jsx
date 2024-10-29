import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("uid", id);
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/project/${id}`,
          {
            withCredentials: true,
          }
        );
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/project/${id}`,
        { title, description },
        { withCredentials: true }
      );
      toast.success("Project updated successfully!");
      navigate("/userDashboard");
    } catch (error) {
      toast.error("Error updating project. Please try again.");
      console.error("Error updating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Edit Project</h1>
      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <label className="block text-gray-700 font-semibold mb-2">
          Project Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
          required
        />

        <label className="block text-gray-700 font-semibold mb-2">
          Project Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
          required
          rows="4"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Project"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProjectForm;
