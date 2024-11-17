import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Account/Login.js";
import CreateAccount1 from "./pages/Account/CreateAccount1.js";
import CreateAccount2 from "./pages/Account/CreateAccount2.js";
import ConfirmIdentity from "./pages/Account/ConfirmIdentity.js";
import DonatorProfile from "./pages/Profile/DonatorProfile.js";
import CreateCampaign from "./pages/Campaigns/CreateCampaign.js";
import Campaign from "./pages/Campaigns/Campaign.js";
import CampaignDonation from "./pages/Campaigns/CampaignDonation.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
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
        <Route
          path="/profile"
          element={<ProtectedRoute element={<DonatorProfile />} />}
        />
        <Route
          path="/create-campaign"
          element={<ProtectedRoute element={<CreateCampaign />} />}
        />
        <Route
          path="/campaign/:id"
          element={<ProtectedRoute element={<Campaign />} />}
        />
        <Route
          path="/campaign/:id/donate"
          element={<ProtectedRoute element={<CampaignDonation />} />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
