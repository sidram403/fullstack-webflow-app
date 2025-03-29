import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkflowCreator from "./pages/WorkflowCreator";
import ProtectedRoute from "./components/ProtectedRoute";
import EditWebflow from "./pages/EditWebFlow";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-workflow" element={<WorkflowCreator />} />
          <Route path="/edit-workflow/:id" element={<EditWebflow />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
