import DonatorLayout from "../layouts/DonatorLayout";
import profileIcon from "../assets/images/profile-big-icon.png";
import medalIcon from "../assets/images/medal.png";
import hexagon from "../assets/images/hexagon.png";
import LevelBorder from "../components/LevelBorder.js";
import Hexagon from "../components/Hexagon.js";
import LinearProgressBar from "../components/LinearProgressBar.js";

function DonatorProfile() {
  return (
    <DonatorLayout>
      <div className="flex flex-row items-center justify-between pr-24 pl-24 2xl:pl-48 2xl:pr-48">
        <div className="text-[#303934] flex flex-row">
          <div className="flex items-center gap-3">
            <img src={profileIcon} alt="profile-icon" className="w-48"></img>
            <div className="flex flex-col h-full gap-2 2xl:gap-4">
              <div className="flex flex-col">
                <label className="font-bold text-3xl 2xl:text-4xl">jovitor123</label>
                <label className="font-semibold text-xl 2xl:text-2xl">(João Castro)</label>
              </div>
              <label className="text-xl">Joined: 13 Jun 2021 at 13:16</label>
              <button className="bg-[#CA0404] rounded rounded-md text-white border-2 border-[#303934] font-semibold p-1 text-lg mt-2 2xl:mt-3">
                Delete Account
              </button>
            </div>
          </div>
        </div>
        <div className="w-[375px] ml-8 bg-[#4E6A56] h-64 rounded-[16px] flex flex-col text-white font-semibold border-2 border-[#1D2320]">
          <div className="flex flex-row mt-2 justify-center">
            <img src={medalIcon} alt="medal-icon" className="w-12 h-12"></img>
            {/* SUPER HIGH:#00EEFF HIGH: #0dcd0d NEUTRAL: #f7c23c */}
            <label className="text-2xl 2xl:text-3xl text-[#00EEFF] font-semibold mt-2">
              Super High Honor
            </label>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="flex flex-row items-center ml-6 mt-4">
                <img src={hexagon} alt="hexagon" className="w-12"></img>
                <label className="ml-2 text-2xl 2xl:text-3xl">
                  295 donations
                </label>
              </div>
              <div className="flex flex-row items-center ml-6 mt-3">
                <img src={hexagon} alt="hexagon" className="w-12"></img>
                <label className="ml-2 text-2xl 2xl:text-3xl">
                  3234,98€ donated
                </label>
              </div>
              <div className="flex flex-row items-center ml-6 mt-3">
                <img src={hexagon} alt="hexagon" className="w-12"></img>
                <div className="flex ml-2 flex-row items-center">
                  <label className="text-lg 2xl:text-xl">
                    Biggest donation:<label> </label>
                  </label>
                  <label className="text-xl ml-1 2xl:text-2xl">293.18€</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-8 bg-[#4E6A56] h-64 w-128 rounded-[16px] flex flex-row items-center border-2 border-[#1D2320]">
          <div className="h-64 w-80 text-white flex flex-col items-center">
            <label className="text-2xl font-semibold mt-2">My Level</label>
            <label className="text-md">Position: 293º (29123 XP)</label>
            <div className="scale-90 items-center flex flex-col relative">
              <Hexagon fillColor="#3C423A" width="112px" height="112px" />
              <label className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold">
                53
              </label>
              <div className="absolute bottom-[-1px]">
                <LevelBorder fillColor="#9F84FF" />
              </div>
            </div>
            <div className="mt-2">
              <LinearProgressBar fillColor="#9F84FF" />
            </div>
            <label className="mt-1">20123XP to next level</label>
          </div>
          <div className="h-64 w-48 text-white flex flex-col items-center">
            <label className="text-2xl font-semibold mt-2">Level System</label>
            <label className="text-md">1€ donated = 10XP</label>
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#FFF584" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 1-9</label>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#84FF8A" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 10-24</label>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#FF8494" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 25-49</label>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#9F84FF" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 50-99</label>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <Hexagon fillColor="#84F1FF" width="26px" height="26px" />
                  <label className="ml-2 text-xl">Level 100+</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DonatorLayout>
  );
}

export default DonatorProfile;
