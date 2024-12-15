import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getCampaignById } from "../api/Campaign";

const ProtectedRoute = ({ element, path }) => {
  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("user_type");
  const [campaignExists, setCampaignExists] = useState(true);
  const [campaignCompleted, setCampaignCompleted] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (path === "/campaign/:id" || path === "/campaign/:id/donate") {
      const fetchCampaign = async () => {
        try {
          const response = await getCampaignById(id, token);
          if (!response) {
            setCampaignExists(false);
          } else if (response.is_completed) {
            console.log("Campaign is completed");
            setCampaignCompleted(true);
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

  if (userType === "Campaign Creator" && path === "/leaderboards") {
    return <Navigate to="/homepage" />;
  }

  if (!campaignExists) {
    return <Navigate to="/homepage" />;
  }

  if (path === "/campaign/:id/donate" && campaignCompleted) {
    return <Navigate to={`/campaign/${id}`} />;
  }

  return element;
};

export default ProtectedRoute;
