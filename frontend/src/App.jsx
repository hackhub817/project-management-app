import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginFom";
import UserDashboard from "./components/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateProject from "./components/CreateProject";
import { AuthProvider } from "./context/AuthContext";
import UpdateProjectForm from "./components/UpdateProjectForm";
import FetchTasks from "./components/FetchTasks";
import CreateTaskForm from "./components/CreateTaskForm";
import UpdateTaskForm from "./components/TaskUpdateForm";
import AssignTask from "./components/AssignTask";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/update-project/:id" element={<UpdateProjectForm />} />
            <Route path="/fetch-tasks/:id" element={<FetchTasks />} />
            <Route
              path="/project/:projectId/create-task"
              element={<CreateTaskForm />}
            />
            <Route path="/update-task/:id" element={<UpdateTaskForm />} />
            <Route path="/assign-task/:id" element={<AssignTask />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
