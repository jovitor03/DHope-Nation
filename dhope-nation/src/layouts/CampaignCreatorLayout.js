import React from "react";
import CampaignCreatorHeader from "../components/CampaignCreatorHeader";
import Footer from "../components/Footer";

function CampaignCreatorLayout({ children }) {
  return (
    <div className="bg-[#A0C0A2] flex flex-col min-h-screen">
      <CampaignCreatorHeader />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default CampaignCreatorLayout;
