import React from "react";
import DonorHeader from "../components/DonorHeader";
import Footer from "../components/Footer";

function DonorLayout({ children }) {
  return (
    <div className="bg-[#A0C0A2] flex flex-col min-h-screen">
      <DonorHeader />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default DonorLayout;
