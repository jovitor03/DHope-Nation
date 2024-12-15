import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getCampaignById } from "../api/Campaign";

const ProtectedRoute = ({ element, path }) => {
  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("user_type");
  const [campaignExists, setCampaignExists] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (path === "/campaign/:id") {
      const fetchCampaign = async () => {
        try {
          const response = await getCampaignById(id, token);
          if (!response) {
            setCampaignExists(false);
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
          setCampaignExists(false);
        }
      };

      fetchCampaign();
    }
  }, [userType, path, id, token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userType === "Donor" && path === "/create-campaign") {
    return <Navigate to="/homepage" />;
  }

  if (
    userType === "Campaign Creator" &&
    (path === "/leaderboards" || path === "/campaign/:id/donate")
  ) {
    return <Navigate to="/homepage" />;
  }

  if (!campaignExists) {
    return <Navigate to="/homepage" />;
  }

  return element;
};

export default ProtectedRoute;