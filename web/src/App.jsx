import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ExplorePlants from "./pages/ExplorePlants";
import PlantDetail from "./pages/PlantDetail";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Bookmarks from "./pages/Bookmarks";

import AdminLoginPage from "./admin/AdminLoginPage";
import AdminDashboard from "./admin/AdminDashboard";
import UserLoginPage from "./user/UserLoginPage";
import UserDashboard from "./user/UserDashboard";
import RoleRoute from "./routes/RoleRoute";
import ProfileRedirect from "./components/ProfileRedirect";

function App() {
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />
        <main style={{ flex: 1, paddingBottom: "40px" }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfileRedirect />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/explore" element={<ExplorePlants />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:id" element={<TourDetail />} />

            {/* User routes */}
            <Route path="/user-login" element={<UserLoginPage />} />
            <Route
              path="/user-dashboard"
              element={
                <RoleRoute element={<UserDashboard />} requiredRole="user" />
              }
            />

            {/* Admin routes */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route
              path="/admin-dashboard"
              element={
                <RoleRoute element={<AdminDashboard />} requiredRole="admin" />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
