import React, { useEffect, useState } from "react";
import DonatorLayout from "../../layouts/DonatorLayout";
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
      } else {
        return [...prevSelected, category];
      }
    });
  };
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

  useEffect(() => {
    console.log(localStorage.getItem("authToken"));
  });

  return (
    <DonatorLayout>
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
      <div className="flex flex-row mt-4 justify-center 2xl:mt-8 ml-20 mr-8">
        <div className="flex flex-col">
          {/* Select category(s) e Deadline lado a lado */}
          <div className="flex flex-row mb-6 w-full items-center mt-4 space-x-12">
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
                <div className="absolute w-full bg-[#4A6B53] border border-green-700 rounded-md shadow-lg max-h-60 overflow-y-auto text-white">
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
          <div className="flex flex-row items-center text-[#35473A] mt-[-15px]">
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
          <div className="flex flex-col w-full mt-4">
            <h2 className="text-[#35473A] text-xl font-semibold">
              Description:
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your campaign's description here! (Max. 250 characters)"
              className="bg-transparent focus:outline-none border border-green-800 text-[#28372C] w-full h-[155px] text-xl p-4 placeholder-gray-500 resize-none"
              maxLength={250}
            ></textarea>
          </div>

          {/* Motivational sentence */}
          <div className="flex flex-col w-full mt-4">
            <h2 className="text-[#35473A] text-xl font-semibold">
              Motivational sentence:
            </h2>
            <div className="flex flex-row items-center space-x-4 text-[#35473A] text-xl font-semibold">
              <label>1€ =</label>
              <input
                type="text"
                value={motivationAmount}
                onChange={(e) => setMotivationAmount(e.target.value)}
                className="bg-transparent focus:outline-none border-b border-b-green-800 ml-2 text-[#28372C] w-1/12 text-xl placeholder-gray-500 text-center"
                placeholder="10"
              />
              <input
                type="text"
                value={motivationItem}
                onChange={(e) => setMotivationItem(e.target.value)}
                className="bg-transparent focus:outline-none border-b border-b-green-800 ml-2 text-[#28372C] w-2/12 text-xl placeholder-gray-500 text-center"
                placeholder="meals"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-row w-full mt-2 items-center text-xl text-[#35473A] ">
            <h2 className="font-semibold">Preview:</h2>
            <label className="ml-2">
              Your contribution will provide {motivationAmount} {motivationItem}
              .
            </label>
          </div>

          {/* Goal e Save Changes lado a lado */}
          <div className="flex flex-row space-x-12 mt-4 w-full items-center">
            <div className="flex flex-col w-[200px]">
              <h2 className="text-[#35473A] text-2xl font-semibold">Goal:</h2>
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
              className="flex-grow h-12 border-2 border-white rounded-md bg-[#4A6B53] text-white text-2xl font-semibold"
              onClick={handleCreateCampaign}
            >
              SAVE CHANGES/CREATE
            </button>
          </div>
        </div>
      </div>
    </DonatorLayout>
  );
}

export default CreateCampaign;
