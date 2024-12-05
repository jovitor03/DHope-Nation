import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Account/Login.js";
import CreateAccount1 from "./pages/Account/CreateAccount1.js";
import CreateAccount2 from "./pages/Account/CreateAccount2.js";
import ConfirmIdentity from "./pages/Account/ConfirmIdentity.js";
import DonorProfile from "./pages/Profile/DonorProfile.js";
import CreateCampaign from "./pages/Campaigns/CreateCampaign.js";
import HomePage from "./pages/Homepage.js";
import Campaign from "./pages/Campaigns/Campaign.js";
import CampaignDonation from "./pages/Campaigns/CampaignDonation.js";
import CampaignSearch from "./pages/Campaigns/CampaignSearch.js";
import Leaderboards from "./pages/Leaderboards.js";
import ProtectedRoute from "./utils/ProtectedRoute.js";
import reportWebVitals from "./reportWebVitals";
import { NotificationProvider } from "./context/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-account/page-1" element={<CreateAccount1 />} />
          <Route path="/create-account/page-2" element={<CreateAccount2 />} />
          <Route path="/confirm-identity" element={<ConfirmIdentity />} />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<DonorProfile />} />}
          />
          <Route
            path="/homepage"
            element={<ProtectedRoute element={<HomePage />} />}
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
          <Route
            path="/campaigns"
            element={<ProtectedRoute element={<CampaignSearch />} />}
          />
          <Route
            path="/leaderboards"
            element={<ProtectedRoute element={<Leaderboards />} />}
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  </React.StrictMode>
);

reportWebVitals();
