import "./index.css";
import "typeface-roboto";
import "typeface-open-sans";
import React from "react";
import ReactDOM from "react-dom/client"; // Sử dụng createRoot từ react-dom/client
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./components/context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ThemeToggle from "./components/ThemeToggle";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import process from "process";
window.process = process;
serviceWorkerRegistration.register();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <GoogleOAuthProvider clientId="203504945599-3v9h0goil9ni43kamqesphfrarjfu440.apps.googleusercontent.com">
      <AppRouter />
    </GoogleOAuthProvider>
  </AuthProvider>
);

//render one
// import React from 'react';
// import ReactDOM from 'react-dom';
// import AppRouter from './router/AppRouter';

// import './index.css';

// ReactDOM.render(
//   <AppRouter />,
//   document.getElementById('root')
// );
