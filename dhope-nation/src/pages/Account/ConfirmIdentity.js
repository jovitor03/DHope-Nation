import "../../styles/Account.css";
import logo from "../../assets/images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { register } from "../../api/Accounts";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    console.log("Details: ", type, name, surname, email, username, password);
  }, [type, name, surname, email, username, password]);

  const handleSignUp = async () => {
    let donator = type === "donator";

    const formData = new FormData();
    formData.append("first_name", name);
    formData.append("last_name", surname);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("is_campaign_creator", !donator);
    formData.append("is_donator", donator);
    formData.append("identification", file);

    try {
      await register(formData);
      alert(
        "Account created successfully! Wait for your account to be validated."
      );
      navigate("/login");
    } catch (error) {
      console.error("Error creating account: ", error);
      alert("An error occurred. Please try again.");
    }
  };

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
        <div className="flex flex-col">
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
            {file ? file.name : "No file selected"}
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <Link
            to="/create-account/page-2"
            className="btn btn-primary bg-white border-2 border-[#34A77F] text-[#34A77F] rounded-md text-lg hover:bg-[#ebebeb] hover:border-[#34A77F] mt-8 w-[12vw]"
          >
            Go Back
          </Link>
          <button
            onClick={handleSignUp}
            className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg hover:bg-[#2e8063] mt-8 w-[12vw]"
          >
            Sign Up
          </button>
        </div>
        <label className="text-[#8C8C8C] font-semibold mt-8 ">
          Copyright © [2024] DHope Nation. <br /> All rights reserved.
        </label>
      </div>
    </div>
  );
}

export default CreateAccount3;
