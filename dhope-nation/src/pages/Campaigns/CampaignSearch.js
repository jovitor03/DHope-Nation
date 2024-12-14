import React, { useEffect, useState, useRef } from "react";
import { getAllCampaigns, getCampaignsByCategory } from "../../api/Campaign";
import { getDonorProfile } from "../../api/Profile";
import CampaignCreatorLayout from "../../layouts/CampaignCreatorLayout";
import DonorLayout from "../../layouts/DonorLayout";
import Pagination from "../../components/Pagination";

const CampaignSearch = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 15;

  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = campaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );

  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = selectedCategories.length
          ? await getCampaignsByCategory(
              localStorage.getItem("authToken"),
              selectedCategories
            )
          : await getAllCampaigns(localStorage.getItem("authToken"));
        setCampaigns(response || []);
      } catch (error) {
        console.error(error);
        setCampaigns([]);
      }
    };

    fetchCampaigns();
  }, [selectedCategories]);

  useEffect(() => {
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

    fetchProfileData();
  }, []);

  const Layout = profileData.is_donor ? DonorLayout : CampaignCreatorLayout;

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const categories = [
    "Education",
    "Health",
    "Environment",
    "Animal Causes",
    "Social Justice",
    "Disaster Relief",
    "Arts & Culture",
    "Other",
  ];

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prevSelected) => {
      const newSelectedCategories = prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category];
      setCurrentPage(1);
      return newSelectedCategories;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navigateToCampaign = (campaignId) => () => {
    window.location.href = `/campaign/${campaignId}`;
  };

  return (
    <Layout>
      <div className="w-full justify-center items-center flex flex-col px-24">
        <h1 className="text-3xl 2xl:text-4xl text-[#28372C] font-semibold">
          Campaigns
        </h1>
        <div className="relative mt-4 w-1/4 z-10">
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full h-12 border border-green-700 rounded-md bg-[#4A6B53] text-left px-4 text-white text-xl"
          >
            {selectedCategories.length === 0
              ? "Select category(s)! (Max. 3)"
              : `${selectedCategories.length} category(s) selected`}
          </button>
          {isOpen && (
            <div
              className="absolute w-full bg-[#4A6B53] border border-green-700 rounded-md shadow-lg max-h-60 overflow-y-auto text-white"
              ref={dropdownRef}
            >
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center px-4 py-2 text-xl"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCheckboxChange(category)}
                    className="mr-2 accent-green-700"
                  />
                  {category}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          {currentCampaigns.length > 0 ? (
            <div className="mt-8 grid grid-cols-3 gap-x-12">
              {currentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="relative mb-8 w-full h-64 flex flex-col items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                  onClick={navigateToCampaign(campaign.id)}
                >
                  <img
                    src={"http://127.0.0.1:8000" + campaign.images[0].image}
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-center">
                    <h3 className="text-3xl font-bold mb-2">
                      {campaign.title}
                    </h3>
                    <p className="text-2xl mb-2">
                      Goal: {campaign.goal.toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-xl text-[#28372C]">
              No campaigns available.
            </p>
          )}
          {currentCampaigns.length > 0 && (
            <div className="mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CampaignSearch;
