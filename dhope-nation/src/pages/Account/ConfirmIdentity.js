import "../../styles/Account.css";
import logo from "../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { register } from "../../api/Accounts";
import { useState, useEffect, useCallback } from "react";

function CreateAccount3() {
  const location = useLocation();
  const { type, name, surname, email, username, password } =
    location.state || {};
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSignUp = useCallback(async () => {
    let donor = false;

    if (type === "donor") {
      donor = true;
    } else if (type === "campaignCreator") {
      donor = false;
    }

    const formData = new FormData();
    formData.append("first_name", name);
    formData.append("last_name", surname);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("is_campaign_creator", !donor);
    formData.append("is_donor", donor);
    formData.append("identification", file);

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      console.error("Error creating account: ", error);
      alert("An error occurred. Please try again.");
    }
  }, [type, name, surname, email, username, password, file, navigate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleSignUp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSignUp]);

  return (
    <div className="account-page text-black">
      <div className="flex flex-col align-middle bg-[#F7FFFD] rounded-[50px] text-center p-12 w-1/3 2xl:w-[30vw] h-auto mx-auto relative transform 2xl:scale-[1.2] mt-16">
        <img
          src={logo}
          alt="logo"
          className="w-2/5 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <h1 className="text-4xl font-bold mt-12 ">Create your account</h1>
        <label className="text-lg mt-4">
          You can only access our website if you are{" "}
          <span className="font-bold">over 18 years old</span>. Please upload a
          valid government-issued ID (e.g., passport, driver's license) with
          your date of birth to confirm your age.
        </label>
        <div className="flex flex-col gap-y-2">
          <div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="btn btn-primary bg-white border-2 border-[#34A77F] text-[#34A77F] rounded-md text-lg hover:bg-[#ebebeb] hover:border-[#34A77F] mt-8 w-[10vw] cursor-pointer"
            >
              Insert File...
            </label>
          </div>
          <span className="text-lg ml-4">
            <span className="font-semibold">File:</span>{" "}
            {file
              ? file.name.length > 30
                ? `${file.name.substring(0, 30)}...`
                : file.name
              : "No file selected"}
          </span>
        </div>
        <button
          onClick={handleSignUp}
          className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg hover:bg-[#2e8063] mt-8 w-[12vw] w-full"
        >
          Sign Up
        </button>
        <label className="text-[#8C8C8C] font-semibold mt-8 ">
          Copyright © [2024] DHope Nation. <br /> All rights reserved.
        </label>
      </div>
    </div>
  );
}

export default CreateAccount3;
