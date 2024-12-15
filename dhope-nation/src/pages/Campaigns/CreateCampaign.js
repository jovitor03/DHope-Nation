import React, { useEffect, useState, useRef, useContext } from "react";
import CampaignCreatorLayout from "../../layouts/CampaignCreatorLayout";
import "../../styles/Campaigns.css";
import { createCampaign, postCampaignImages } from "../../api/Campaign";
import { useNavigate } from "react-router-dom";
import plusIcon from "../../assets/images/plus.png";
import imageIcon from "../../assets/images/image.png";
import { NotificationContext } from "../../context/NotificationContext";
import LoadingScreen from "../../components/LoadingScreen";

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
  const [loading, setLoading] = useState(true);

  const { showNotification } = useContext(NotificationContext);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length !== 4) {
      showNotification("Please select 4 images.", "error");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter((file) => file.size <= maxSize);
    if (validFiles.length < files.length) {
      showNotification(
        "One or more files are too large. Maximum size is 10 MB.",
        "error"
      );
      return;
    }
    if (validFiles.length < 4) {
      showNotification("Please select 4 images.", "error");
      return;
    }

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
      if (prevSelected.includes(category)) {
        return prevSelected.filter((item) => item !== category);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, category];
      } else {
        return prevSelected;
      }
    });
  };

  const validateFields = () => {
    if (title.length < 10) {
      showNotification(
        "Please enter a title with at least 10 characters.",
        "error"
      );
      return false;
    }

    if (deadline.length === 0) {
      showNotification("Please select a deadline.", "error");
      return false;
    }
    const selectedDate = new Date(deadline);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      showNotification(
        "Please select a future date for the deadline.",
        "error"
      );
      return false;
    }

    if (selectedCategories.length === 0) {
      showNotification("Please select at least one category.", "error");
      return false;
    }

    if (description.length < 200) {
      showNotification(
        "Please enter a description with at least 200 characters.",
        "error"
      );
      return false;
    }

    if (motivationAmount.length <= 0) {
      showNotification(
        "Please enter a motivation amount bigger than 0.",
        "error"
      );
      return false;
    }
    if (motivationItem.length <= 0) {
      showNotification("Please complete the motivational sentence.", "error");
      return false;
    }

    if (goal < 100 || goal > 1000000) {
      showNotification(
        "Please enter a goal between 100 and 1000000 euros.",
        "error"
      );
      return false;
    }

    if (imagePreviews.length !== 4) {
      showNotification("Please select 4 images.", "error");
      return false;
    }
    return true;
  };

  const handleCreateCampaign = async () => {
    if (!validateFields()) {
      return;
    }

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
      const campaignId = responseData.id;

      const images = Array.from(document.getElementById("image-upload").files);

      for (const image of images) {
        const imageData = new FormData();
        imageData.append("image", image);
        await postCampaignImages(token, campaignId, imageData);
      }

      navigate("/homepage");
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
    }
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      {!loading && (
        <div className="fade-in">
          <CampaignCreatorLayout>
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
            <div className="flex flex-row justify-between">
              <div className="flex flex-col justify-start mr-16 ml-20 items-center w-5/12">
                {imagePreviews.length > 0 ? (
                  <div className="flex flex-col mt-32 2xl:mt-40 items-center mb-[-40px] border-r border-l border-b border-black">
                    <div className="w-7/12 items-center flex flex-col text-center justify-center mb-4 scale-171">
                      <img
                        src={imagePreviews[0]}
                        alt="Main"
                        className="h-36 w-full 2xl:h-[191px] object-cover border-t border-black"
                      />
                    </div>
                    <div className="flex flex-row justify-between mt-9 2xl:mt-12 z-10">
                      {imagePreviews.slice(1).map((image, index) => (
                        <div
                          key={index}
                          className={`flex justify-center items-center bg-white ${
                            index !== 0 ? "border-l border-black" : ""
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 2}`}
                            className="w-40 h-24 2xl:h-36 2xl:w-52 object-cover border-t border-black"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mt-32 2xl:mt-44 mb-[-40px]">
                    <div
                      className="px-7 py-7 bg-white items-center flex flex-col text-center justify-center cursor-pointer mb-4 scale-167 2xl:scale-217 border border-black"
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                    >
                      <img
                        src={plusIcon}
                        alt="+"
                        className="w-14 h-14 cursor-pointer"
                      />
                      <label className="text-[#A3A3A3] font-semibold text-sm mt-1 cursor-pointer">
                        Please add 4 campaign images here!
                      </label>
                      <label className="text-[#A3A3A3] font-semibold text-[10px] cursor-pointer">
                        Maximum size: 10 MB
                      </label>
                    </div>
                    <div className="flex flex-row w-full justify-between mt-8 2xl:mt-16 border border-black">
                      <div className="w-40 h-24 2xl:h-36 2xl:w-52 flex justify-center items-center bg-white border border-black">
                        <img alt="+2" src={imageIcon} className="w-12 h-12" />
                      </div>
                      <div className="w-40 h-24 2xl:h-36 2xl:w-52 flex justify-center items-center bg-white border border-black">
                        <img alt="+2" src={imageIcon} className="w-12 h-12" />
                      </div>
                      <div className="w-40 h-24 2xl:h-36 2xl:w-52 flex justify-center items-center bg-white border border-black">
                        <img alt="+2" src={imageIcon} className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image-upload"
                  className="hidden"
                  multiple
                />
              </div>

              <div className="flex flex-row mt-4 justify-end ml-16 mr-8 w-2/3">
                <div className="flex flex-col w-full gap-2">
                  <div className="flex flex-row mb-6 w-full items-center mt-6 space-x-12 justify-center">
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

                    <div className="relative w-[330px] z-10">
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
                  </div>

                  <div className="flex flex-row items-center text-[#35473A] mt-[-20px]">
                    <h2 className="font-semibold text-xl">
                      Selected Category(s):
                    </h2>
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

                  <div className="flex flex-col w-full">
                    <h2 className="text-[#35473A] text-xl font-semibold">
                      Description:
                    </h2>
                    <div className="relative">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write your campaign's description here! (Min. 200 characters)"
                        style={{ height: textareaHeight }}
                        className="bg-transparent focus:outline-none border border-green-800 text-[#28372C] w-full text-xl p-4 placeholder-gray-500 resize-none text-justify"
                        maxLength={350}
                      ></textarea>
                      <div className="absolute bottom-2 right-2 text-gray-500 text-xl">
                        {description.length}/350
                      </div>
                    </div>
                  </div>

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
                        maxLength={4}
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

                  <div className="flex flex-row w-full items-center text-xl text-[#35473A] justify-center">
                    <h2 className="font-semibold">Preview:</h2>
                    <label className="ml-2">
                      Your contribution will provide {motivationAmount}{" "}
                      {motivationItem}.
                    </label>
                  </div>

                  <div className="flex flexs-row space-x-12 w-full items-center">
                    <div className="flex flex-col w-[200px]">
                      <h2 className="text-[#35473A] text-xl font-semibold">
                        Goal:
                      </h2>
                      <div className="relative w-full">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl text-[#28372C] font-semibold">
                          €
                        </span>
                        <input
                          type="number"
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          className="bg-transparent focus:outline-none border-b border-green-800 text-[#28372C] w-full text-xl pl-8 placeholder-gray-500 custom-number-input"
                          placeholder="Your goal here!"
                        />
                      </div>
                    </div>

                    <button
                      className="flex-grow h-12 border-2 border-white rounded-md bg-[#4A6B53] text-white text-2xl font-semibold mb-[-10px] shadow-y"
                      onClick={handleCreateCampaign}
                    >
                      SAVE CHANGES/CREATE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CampaignCreatorLayout>
        </div>
      )}
    </div>
  );
}

export default CreateCampaign;
