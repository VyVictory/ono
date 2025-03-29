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
import ProfileLayout from "../Layout/ProfileLayout.jsx"; 
import HomeLayout from "../Layout/HomeLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx"; 
import { MainProvider } from "./MainProvider.jsx";
const AppRouter = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<UserPage />} /> 
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/messages/*" element={<Messages />} />
        <Route path="/profile/*" element={<ProfileLayout />} />
      </Route>
      <Route path="/*" element={<HomeLayout />} />
    </Route>
    {/* <Route path="/test" element={<Test />} /> */}
    <Route path="/login/*" element={<Auth />} />
    <Route path="/auth/callback" element={<Auth />} />
  </Routes>
);

const App = () => {
  const { showLogin, setShowLogin } = useAuth();

  return ( 
      <Router>
        <MainProvider>
          {showLogin && <Auth />}
          <AppRouter />{" "}
          <ToastContainer
            position="top-left"
            className="toast-container "
            style={{ marginTop: "20px", paddingRight: "60px" }} 
            limit={3}
          />
        </MainProvider>
      </Router>

  );
};

export default App;
