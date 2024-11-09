import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import CreateAccount1 from "./pages/CreateAccount1";
import CreateAccount2 from "./pages/CreateAccount2";
import ConfirmIdentity from "./pages/ConfirmIdentity";
import DonatorProfile from "./pages/DonatorProfile";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account/page-1" element={<CreateAccount1 />} />
        <Route path="/create-account/page-2" element={<CreateAccount2 />} />
        <Route path="/confirm-identity" element={<ConfirmIdentity />} />
        <Route path="/profile" element={<DonatorProfile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
