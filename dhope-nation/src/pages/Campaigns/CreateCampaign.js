import React, { useEffect, useState, useRef } from "react";
import CampaignCreatorLayout from "../../layouts/CampaignCreatorLayout";
import "../../styles/Campaigns.css";
import { createCampaign } from "../../api/Campaign";

function CreateCampaign() {
  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [motivationAmount, setMotivationAmount] = useState("");
  const [motivationItem, setMotivationItem] = useState("");
  const [goal, setGoal] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState("150px");
  const [showAlert, setShowAlert] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateTextareaHeight = () => {
      if (window.innerHeight > 800 && window.innerHeight <= 900) {
        setTextareaHeight("300px");
      } else if (window.innerHeight > 900 && window.innerHeight <= 1000) {
        setTextareaHeight("310px");
      } else if (window.innerHeight > 1000) {
        setTextareaHeight("400px");
      } else {
        setTextareaHeight("150px");
      }
    };

    updateTextareaHeight();
    window.addEventListener("resize", updateTextareaHeight);

    return () => window.removeEventListener("resize", updateTextareaHeight);
  }, []);

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
      if (prevSelected.includes(category)) {
        return prevSelected.filter((item) => item !== category);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, category];
      } else {
        setShowAlert(true);
        return prevSelected;
      }
    });
  };

  useEffect(() => {
    if (showAlert) {
      alert("You can only choose a maximum of 3 categories.");
      setShowAlert(false);
    }
  }, [showAlert]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateCampaign = async () => {
    console.log(selectedCategories);

    const data = {
      title: title,
      category: selectedCategories,
      end_date: deadline,
      description: description,
      ratio: motivationAmount,
      sentence: motivationItem,
      goal: goal,
    };

    const token = localStorage.getItem("authToken");

    try {
      const responseData = await createCampaign(token, data);
      console.log(responseData);
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
    }
  };

  return (
    <CampaignCreatorLayout>
      {/* Título - centrado */}
      <div className="flex flex-row justify-center mt-[-20px]">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write your campaign's title here (Max. 50 characters)"
          maxLength={50}
          className="bg-transparent focus:outline-none border-b border-black text-[#28372C] font-semibold w-3/4 text-center text-3xl 2xl:text-4xl placeholder-gray-500"
        />
      </div>

      {/* Conteúdo principal na metade da direita */}
      <div className="flex flex-row mt-4 justify-center ml-20 mr-8">
        <div className="flex flex-col w-1/2 gap-2">
          {/* Select category(s) e Deadline lado a lado */}
          <div className="flex flex-row mb-6 w-full items-center mt-6 space-x-12 justify-center">
            <div className="relative w-[330px]">
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full h-12 border border-green-700 rounded-md bg-[#4A6B53] text-left px-4 text-white text-xl"
              >
                {selectedCategories.length === 0
                  ? "Click here to select category(s)!"
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

            {/* Deadline */}
            <div className="flex flex-col items-start w-[180px] ml-5 mt-[-30px]">
              <h3 className="text-[#35473A] text-xl font-semibold">
                Deadline:
              </h3>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border border-green-700 rounded-md h-12 pl-2 text-white bg-[#4A6B53] text-xl w-full"
              />
            </div>
          </div>

          {/* Selected Category(s) */}
          <div className="flex flex-row items-center text-[#35473A] mt-[-20px]">
            <h2 className="font-semibold text-xl">Selected Category(s):</h2>
            <div className="ml-2">
              {selectedCategories.length === 0 ? (
                <span className="text-[#35473A] text-xl">
                  Your selected category(s) will appear here!
                </span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-[#C8E5C3] text-[#35473A] py-1 px-3 rounded-full border border-green-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col w-full">
            <h2 className="text-[#35473A] text-xl font-semibold">
              Description:
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your campaign's description here! (Max. 250 characters)"
              style={{ height: textareaHeight }}
              className="bg-transparent focus:outline-none border border-green-800 text-[#28372C] w-full text-xl p-4 placeholder-gray-500 resize-none"
              maxLength={250}
            ></textarea>
          </div>

          {/* Motivational sentence */}
          <div className="flex flex-col md:flex-row w-full items-center md:space-x-4 justify-center">
            <h2 className="text-[#35473A] text-xl font-semibold text-center md:text-left w-full md:w-auto">
              Motivational sentence: 1€ =
            </h2>
            <div className="flex flex-row items-center justify-center md:justify-start space-x-2 text-[#35473A] text-xl font-semibold w-full md:w-auto mt-2 md:mt-0">
              <input
                type="text"
                value={motivationAmount}
                onChange={(e) => setMotivationAmount(e.target.value)}
                className="bg-transparent focus:outline-none border-b border-b-green-800 text-[#28372C] w-1/4 md:w-24 text-xl placeholder-gray-500 text-center"
                placeholder="10"
              />
              <input
                type="text"
                value={motivationItem}
                onChange={(e) => setMotivationItem(e.target.value)}
                className="bg-transparent focus:outline-none border-b border-b-green-800 text-[#28372C] w-1/2 md:w-64 text-xl placeholder-gray-500 text-center"
                placeholder="meals"
                maxLength={20}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-row w-full items-center text-xl text-[#35473A] justify-center">
            <h2 className="font-semibold">Preview:</h2>
            <label className="ml-2">
              Your contribution will provide {motivationAmount} {motivationItem}
              .
            </label>
          </div>
          {/* Goal e Save Changes lado a lado */}
          <div className="flex flexs-row space-x-12 w-full items-center">
            <div className="flex flex-col w-[200px]">
              <h2 className="text-[#35473A] text-xl font-semibold">Goal:</h2>
              <div className="relative w-full">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl text-[#28372C] font-semibold">
                  €
                </span>
                <input
                  type="number"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="bg-transparent focus:outline-none border-b border-green-800 text-[#28372C] w-full text-xl pl-8 placeholder-gray-500 custom-number-input"
                  placeholder="Max. 1.000.000€"
                />
              </div>
            </div>

            {/* Botão de Save Changes expandido */}
            <button
              className="flex-grow h-12 border-2 border-white rounded-md bg-[#4A6B53] text-white text-2xl font-semibold mb-[-10px]"
              onClick={handleCreateCampaign}
            >
              SAVE CHANGES/CREATE
            </button>
          </div>
        </div>
      </div>
    </CampaignCreatorLayout>
  );
}

export default CreateCampaign;
