import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Layout from "../Layout/Layout.jsx";
import Auth from "../Layout/Auth.jsx";

import UserPage from "../pages/UserPage";
import Messages from "../pages/messager/Messages.jsx";
import { useAuth } from "../components/context/AuthProvider.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Profile from "../pages/profile/profile.jsx";
import Profile from "../pages/profile/profile.jsx";
// import Test from "../pages/test.jsx";

import { useEffect } from "react";
import ProfileLayout from "../Layout/ProfileLayout.jsx";
import { PhotoSwipeProvider } from "../components/context/PhotoSwipeProvider.jsx";
import HomeLayout from "../Layout/HomeLayout.jsx";
const AppRouter = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<UserPage />} />
      </Route>
      <Route path="/messages/*" element={<Messages />} />
      <Route path="/profile/*" element={<ProfileLayout />} />
      {/* <Route path="/profile1" element={<Profile1 />} /> */}
      {/* Các route khác */}
    </Route>
    {/* <Route path="/test" element={<Test />} /> */}
    <Route path="/login" element={<Auth />} />
  </Routes>
);

const App = () => {
  const { showLogin, setShowLogin } = useAuth();

  return (
    <PhotoSwipeProvider>
      <Router>
        {showLogin && <Auth />}
        <AppRouter />{" "}
        <ToastContainer position="top-left" autoClose={3000} limit={3} />
      </Router>
    </PhotoSwipeProvider>
  );
};

export default App;
