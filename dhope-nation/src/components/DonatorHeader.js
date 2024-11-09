import React from "react";
import logo from "../assets/images/logo-header.png";
import profileIcon from "../assets/images/profile-icon.png";

function Header() {
  return (
    <div className="flex flex-row items-center justify-between">
      <img src={logo} alt="logo" className="w-1/4 mt-4"></img>
      <div className="flex flex-row items-center gap-12 mr-16">
        <label className="text-3xl text-[#062134] font-semibold">
          CAMPAIGNS
        </label>
        <label className="text-3xl text-[#062134] font-semibold">
          LEADERBOARDS
        </label>
        <img alt="logo" src={profileIcon}></img>
      </div>
    </div>
  );
}

export default Header;
