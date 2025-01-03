import React, { useState } from "react";
import logo from "../assets/images/logo-header.png";
import profileIcon from "../assets/images/profile-icon.png";
import logoutIcon from "../assets/images/logout.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile/campaign-creator");
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setIsModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  const goToHomepage = () => {
    navigate("/homepage");
  };

  const goToCampaigns = () => {
    navigate("/campaigns");
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <img
        src={logo}
        alt="logo"
        className="w-1/4 mt-4 hover:cursor-pointer"
        onClick={goToHomepage}
      ></img>
      <div className="flex flex-row items-center gap-12 mr-16">
        <label
          className="text-3xl text-[#062134] font-semibold hover:cursor-pointer"
          onClick={goToCampaigns}
        >
          CAMPAIGNS
        </label>
        <img
          alt="logo"
          src={profileIcon}
          className="w-[70px] mr-[-20px] hover:cursor-pointer"
          onClick={handleProfileClick}
        ></img>
        <img
          alt="logo"
          src={logoutIcon}
          className="w-[64px] hover:cursor-pointer"
          onClick={handleLogoutClick}
        ></img>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-[#f1f5f0] p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-2xl font-semibold mb-4 text-[#516158]">
              Are you sure you want to log out from your account?
            </h2>
            <div className="flex justify-center space-x-12">
              <button
                className="bg-[#34A77F] text-white px-4 py-2 rounded-md hover:bg-[#2e8063] text-xl"
                onClick={handleConfirmLogout}
              >
                Yes
              </button>
              <button
                className="bg-[#CA0404] text-white px-4 py-2 rounded-md hover:bg-red-700 text-xl font-semibold"
                onClick={handleCancelLogout}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
