import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setError("");
      login(response.data.token);

      navigate("/userDashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Login failed. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const redirectToHome = () => {
    navigate("/");
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-blue-500 py-4 lg:py-12 px-4">
      <div className="flex flex-col items-center justify-center text-white w-full max-w-md lg:max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-6">Login</h1>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition duration-300"
          >
            Log In
          </button>

          {error && (
            <p className="text-red-500 text-sm font-semibold mt-4">{error}</p>
          )}

          <p className="mt-4 text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              onClick={redirectToHome}
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
