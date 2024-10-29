import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`http:///api/auth/logout`, {
        withCredentials: true,
      });
      logout(navigate);
    } catch (error) {
      console.error(
        "Error logging out:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <nav className="bg-gray-900 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">
          Project Dashboard
        </h1>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/userDashboard"
            className="text-yellow-300 hover:text-yellow-400 transition duration-200"
          >
            Projects
          </Link>

          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 transition duration-200 font-semibold"
          >
            Logout
          </button>
        </div>

        <button className="md:hidden flex items-center px-3 py-2 border rounded text-yellow-400 border-yellow-400 hover:text-yellow-300 hover:border-yellow-300">
          <svg
            className="fill-current h-5 w-5"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0zM0 8h20v2H0zM0 13h20v2H0z" />
          </svg>
        </button>
      </div>

      <div className="md:hidden mt-4">
        <Link
          to="/userDashboard"
          className="block py-2 text-yellow-300 hover:bg-gray-700 rounded-lg px-4"
        >
          Projects
        </Link>
        <button
          onClick={handleLogout}
          className="block py-2 text-red-400 hover:bg-gray-700 rounded-lg px-4 font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
