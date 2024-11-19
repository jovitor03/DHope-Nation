import React from "react";
import DonatorHeader from "../components/DonatorHeader";
import Footer from "../components/Footer";

function DonatorLayout({ children }) {
  return (
    <div className="bg-[#A0C0A2] flex flex-col min-h-screen">
      <DonatorHeader />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default DonatorLayout;
