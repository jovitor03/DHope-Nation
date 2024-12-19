import React, { useState, useEffect } from "react";
import {
  getLeaderboards,
  getLeaderboardsLast30Days,
} from "../api/Leaderboards.js";
import { getDonorProfile } from "../api/Profile.js";
import CampaignCreatorLayout from "../layouts/CampaignCreatorLayout";
import DonorLayout from "../layouts/DonorLayout.js";
import LevelBorder from "../components/LevelBorder.js";
import Hexagon from "../components/Hexagon.js";
import LoadingScreen from "../components/LoadingScreen.js";
import { getIfTokenExists } from "../api/Accounts.js";

const Leaderboards = () => {
  const [globalLeaderboards, setGlobalLeaderboards] = useState([]);
  const [last30DaysLeaderboards, setLast30DaysLeaderboards] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [profileStats, setProfileStats] = useState({});
  const [loading, setLoading] = useState(true);

  const verifyToken = async (token) => {
    try {
      const response = await getIfTokenExists(token);
      if (response.status !== 200) {
        console.error("Token inválido.");
        return;
      } else {
        console.log("Token válido.");
      }
    } catch (error) {
      window.location.href = "/login";
      return;
    }
  };

  const fetchLeaderboardsLast30Days = async () => {
    const data = await getLeaderboardsLast30Days(localStorage.getItem("token"));
    const leaderboardLast30DaysData = data.map((item) => ({
      id: item.id,
      username: item.donor.user.username,
      level: item.donor.level,
      xp: item.donor.xp,
      honor: item.donor.honor,
      total_donated: item.total_donated,
      rank: item.donor.rank,
    }));
    setLast30DaysLeaderboards(leaderboardLast30DaysData);
  };

  const fetchLeaderboards = async () => {
    const data = await getLeaderboards(localStorage.getItem("token"));
    const leaderboardData = data.map((item) => ({
      id: item.id,
      username: item.user.username,
      level: item.level,
      xp: item.xp,
      honor: item.honor,
      total_donated: item.donation_value,
      rank: item.rank,
    }));
    setGlobalLeaderboards(leaderboardData);
  };

  const fetchProfileData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getDonorProfile(token);
      setProfileData(response.data.donor.user);
    } catch (error) {
      console.error("Erro ao obter os dados do perfil:", error);
    }
  };

  const fetchProfileStats = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
    try {
      const response = await getDonorProfile(token);
      setProfileStats(response.data.donor);
    } catch (error) {
      console.error("Erro ao obter os dados do perfil:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    } else {
      verifyToken(token);
    }

    setLoading(true);
    fetchProfileData();
    fetchProfileStats();
    fetchLeaderboards();
    fetchLeaderboardsLast30Days();
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const Layout = profileData.is_donor ? DonorLayout : CampaignCreatorLayout;

  const getLevelBorderColor = (level) => {
    if (level >= 0 && level <= 9) return "#FFF584";
    if (level >= 10 && level <= 24) return "#84FF8A";
    if (level >= 25 && level <= 49) return "#FF8494";
    if (level >= 50 && level <= 99) return "#9F84FF";
    return "#84F1FF";
  };

  const isUserInGlobalLeaderboards = globalLeaderboards.some(
    (leaderboardStats) => leaderboardStats.username === profileData.username
  );

  const isUserInLast30DaysLeaderboards = last30DaysLeaderboards.some(
    (leaderboardStats) => leaderboardStats.username === profileData.username
  );

  return (
    <div>
      {loading && <LoadingScreen />}
      {!loading && (
        <div className="fade-in">
          <Layout>
            <div className="container mx-auto">
              <div className="flex justify-between mt-2 mb-12">
                <div className="w-1/2 pr-2 text-center 2xl:ml-36">
                  <h2 className="text-3xl font-semibold text-[#28372C] mb-4">
                    Global Leaderboards
                  </h2>
                  <ul className="bg-[#4E6A56] text-white shadow-md rounded-lg p-2">
                    {globalLeaderboards.map((leaderboardStats, index) => (
                      <li
                        key={leaderboardStats.id}
                        className={`flex items-center p-2 border-b last:border-b-0 ${
                          leaderboardStats.username === profileData.username
                            ? "bg-[#6A8A76]"
                            : ""
                        }`}
                      >
                        <div className="flex flex-row items-center w-full">
                          <label
                            className={`ml-2 mr-4 ${
                              index === 9 ? "px-[9px]" : " px-4"
                            } text-2xl border border-4 rounded-full py-3 font-bold`}
                          >
                            {index + 1}º
                          </label>
                          <div className="relative border-l border-white h-full px-4">
                            <Hexagon
                              fillColor="#3C423A"
                              width="112px"
                              height="112px"
                            />
                            <div className="absolute bottom-[-1px] left-[23px]">
                              <LevelBorder
                                fillColor={getLevelBorderColor(
                                  leaderboardStats.level
                                )}
                              />
                            </div>
                            <span
                              className={`absolute inset-0 flex items-center justify-center font-bold text-white ${
                                String(leaderboardStats.level).length >= 3
                                  ? "text-4xl"
                                  : "text-5xl"
                              }`}
                            >
                              {leaderboardStats.level}
                            </span>
                          </div>
                          <div className="flex flex-col items-start">
                            <label className="text-3xl font-bold">
                              {leaderboardStats.username}
                            </label>
                            <label
                              className={`text-2xl font-semibold ${
                                leaderboardStats.honor === "Super High Honor"
                                  ? "text-[#fc6075]"
                                  : leaderboardStats.honor === "High Honor"
                                  ? "text-[#0dcd0d]"
                                  : leaderboardStats.honor === "Neutral Honor"
                                  ? "text-[#f7c23c]"
                                  : leaderboardStats.honor === "Epic Honor"
                                  ? "text-[#9F84FF]"
                                  : leaderboardStats.honor === "Legendary Honor"
                                  ? "text-[#00EEFF]"
                                  : ""
                              }`}
                            >
                              {leaderboardStats.honor}
                            </label>
                            <label className="text-xl">
                              {leaderboardStats.xp} XP
                            </label>
                          </div>
                          <label className="text-2xl font-bold ml-auto">
                            {leaderboardStats.total_donated.toFixed(2)}€
                          </label>
                        </div>
                      </li>
                    ))}
                    {!isUserInGlobalLeaderboards && (
                      <li className="flex items-center p-2 border-t-2 last:border-b-0 bg-[#6A8A76]">
                        <div className="flex flex-row items-center w-full ml-6">
                          <div className="relative">
                            <Hexagon
                              fillColor="#3C423A"
                              width="112px"
                              height="112px"
                            />
                            <div className="absolute bottom-[-1px] left-[7px]">
                              <LevelBorder
                                fillColor={getLevelBorderColor(
                                  profileStats.level
                                )}
                              />
                            </div>
                            <span
                              className={`absolute inset-0 flex items-center justify-center font-semibold text-white ${
                                String(profileStats.level).length >= 3
                                  ? "text-4xl"
                                  : "text-5xl"
                              }`}
                            >
                              {profileStats.level}
                            </span>
                          </div>
                          <div className="flex flex-col items-start ml-4">
                            <label className="text-3xl font-bold">
                              {profileData.username} ({profileStats.rank}º)
                            </label>
                            <label
                              className={`text-2xl font-semibold ${
                                profileStats.honor === "Super High Honor"
                                  ? "text-[#fc6075]"
                                  : profileStats.honor === "High Honor"
                                  ? "text-[#0dcd0d]"
                                  : profileStats.honor === "Neutral Honor"
                                  ? "text-[#f7c23c]"
                                  : profileStats.honor === "Epic Honor"
                                  ? "text-[#9F84FF]"
                                  : profileStats.honor === "Legendary Honor"
                                  ? "text-[#00EEFF]"
                                  : ""
                              }`}
                            >
                              {profileStats.honor}
                            </label>
                            <label className="text-xl">
                              {profileStats.xp} XP
                            </label>
                          </div>
                          <label className="text-2xl font-bold ml-auto mr-14">
                            {profileStats.donation_value != null
                              ? `${profileStats.donation_value.toFixed(2)}€`
                              : "0.00€"}
                          </label>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="w-1/2 pl-2 text-center 2xl:mr-36">
                  <h2 className="text-3xl font-semibold text-[#28372C] mb-4">
                    Last 30 Days Leaderboards
                  </h2>
                  <ul className="bg-[#4E6A56] text-white shadow-md rounded-lg p-2">
                    {last30DaysLeaderboards.map((leaderboardStats, index) => (
                      <li
                        key={leaderboardStats.id}
                        className={`flex items-center p-2 border-b last:border-b-0 ${
                          leaderboardStats.username === profileData.username
                            ? "bg-[#6A8A76]"
                            : ""
                        }`}
                      >
                        <div className="flex flex-row items-center w-full">
                          <label
                            className={`ml-2 mr-4 ${
                              index === 9 ? "px-[9px]" : " px-4"
                            } text-2xl border border-4 rounded-full py-3 font-bold`}
                          >
                            {index + 1}º
                          </label>
                          <div className="relative border-l border-white h-full px-4">
                            <Hexagon
                              fillColor="#3C423A"
                              width="112px"
                              height="112px"
                            />
                            <div className="absolute bottom-[-1px] left-[23px]">
                              <LevelBorder
                                fillColor={getLevelBorderColor(
                                  leaderboardStats.level
                                )}
                              />
                            </div>
                            <span
                              className={`absolute inset-0 flex items-center justify-center font-bold text-white ${
                                String(leaderboardStats.level).length >= 3
                                  ? "text-4xl"
                                  : "text-5xl"
                              }`}
                            >
                              {leaderboardStats.level}
                            </span>
                          </div>
                          <div className="flex flex-col items-start">
                            <label className="text-3xl font-bold">
                              {leaderboardStats.username}
                            </label>
                            <label
                              className={`text-2xl font-semibold ${
                                leaderboardStats.honor === "Super High Honor"
                                  ? "text-[#fc6075]"
                                  : leaderboardStats.honor === "High Honor"
                                  ? "text-[#0dcd0d]"
                                  : leaderboardStats.honor === "Neutral Honor"
                                  ? "text-[#f7c23c]"
                                  : leaderboardStats.honor === "Epic Honor"
                                  ? "text-[#9F84FF]"
                                  : leaderboardStats.honor === "Legendary Honor"
                                  ? "text-[#00EEFF]"
                                  : ""
                              }`}
                            >
                              {leaderboardStats.honor}
                            </label>
                            <label className="text-xl">
                              {leaderboardStats.xp} XP
                            </label>
                          </div>
                          <label className="text-2xl font-bold ml-auto">
                            {leaderboardStats.total_donated.toFixed(2)}€
                          </label>
                        </div>
                      </li>
                    ))}
                    {!isUserInLast30DaysLeaderboards && (
                      <li className="flex items-center p-2 border-t-2 last:border-b-0 bg-[#6A8A76]">
                        <div className="flex flex-row items-center w-full ml-6">
                          <div className="relative">
                            <Hexagon
                              fillColor="#3C423A"
                              width="112px"
                              height="112px"
                            />
                            <div className="absolute bottom-[-1px] left-[7px]">
                              <LevelBorder
                                fillColor={getLevelBorderColor(
                                  profileStats.level
                                )}
                              />
                            </div>
                            <span
                              className={`absolute inset-0 flex items-center justify-center font-bold text-white ${
                                String(profileStats.level).length >= 3
                                  ? "text-4xl"
                                  : "text-5xl"
                              }`}
                            >
                              {profileStats.level}
                            </span>
                          </div>
                          <div className="flex flex-col items-start ml-4">
                            <label className="text-3xl font-bold">
                              {profileData.username}
                            </label>
                            <label
                              className={`text-2xl font-semibold ${
                                profileStats.honor === "Super High Honor"
                                  ? "text-[#fc6075]"
                                  : profileStats.honor === "High Honor"
                                  ? "text-[#0dcd0d]"
                                  : profileStats.honor === "Neutral Honor"
                                  ? "text-[#f7c23c]"
                                  : profileStats.honor === "Epic Honor"
                                  ? "text-[#9F84FF]"
                                  : profileStats.honor === "Legendary Honor"
                                  ? "text-[#00EEFF]"
                                  : ""
                              }`}
                            >
                              {profileStats.honor}
                            </label>
                            <label className="text-xl">
                              {profileStats.xp} XP
                            </label>
                          </div>
                          <label className="text-2xl font-bold ml-auto mr-14">
                            {profileStats.donation_value != null
                              ? `${profileStats.donation_value.toFixed(2)}€`
                              : "0.00€"}
                          </label>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </Layout>
        </div>
      )}
    </div>
  );
};

export default Leaderboards;
