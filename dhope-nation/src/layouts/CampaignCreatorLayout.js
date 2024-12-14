import React, { useContext } from "react";
import CampaignCreatorHeader from "../components/CampaignCreatorHeader";
import Footer from "../components/Footer";
import Notification from "../components/Notification";
import { NotificationContext } from "../context/NotificationContext";

function CampaignCreatorLayout({ children }) {
  const { notifications } = useContext(NotificationContext);

  return (
    <div className="bg-[#A0C0A2] flex flex-col min-h-screen">
      {notifications.length > 0 && (
        <Notification notifications={notifications} />
      )}
      <CampaignCreatorHeader />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default CampaignCreatorLayout;
