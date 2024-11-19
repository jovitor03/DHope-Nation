import "../../styles/Account.css";
import logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateAccount1() {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleNextPage = () => {
    if (!type || !name || !surname || !email) {
      return;
    }
    navigate(`/create-account/page-2`, {
      state: { type, name, surname, email },
    });
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#809F8B] underline underline-offset-2 font-bold"
          >
            Sign In
          </Link>
        </label>
        <label className="text-left font-bold text-lg mt-6">
          Account Type<span className="text-[#FF0000]">*</span>
        </label>
        <div className="flex flex-row w-full gap-6">
          <div className="flex items-center">
            <input
              type="radio"
              name="userType"
              className="appearance-none w-5 h-5 bg-white border-2 rounded-full relative border-gray-400"
              value={"donator"}
              onChange={(e) => setType(e.target.value)}
            />
            <label className="text-left text-lg mt-0 ml-2">Donator</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="userType"
              className="appearance-none w-5 h-5 bg-white border-2 rounded-full relative border-gray-400"
              value={"campaignCreator"}
              onChange={(e) => setType(e.target.value)}
            />
            <label className="text-left text-lg mt-0 ml-2">
              Campaign Creator
            </label>
          </div>
        </div>
        <div className="flex flex-row mt-4 justify-between">
          <div className="flex flex-col text-left">
            {" "}
            <label className="font-bold text-lg">
              Name<span className="text-[#FF0000]">*</span>
            </label>
            <input
              type="text"
              className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg px-4 focus:outline-none focus:border-black w-[12vw]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-left ml-4">
            <label className="font-bold text-lg">
              Surname<span className="text-[#FF0000]">*</span>
            </label>
            <input
              type="text"
              className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg px-4 focus:outline-none focus:border-black w-[12vw]"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
        </div>
        <label className="text-left font-bold text-lg mt-4">
          Email<span className="text-[#FF0000]">*</span>
        </label>
        <input
          type="text"
          className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg px-4 focus:outline-none focus:border-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleNextPage}
          className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg hover:bg-[#2e8063] mt-8"
        >
          Next
        </button>
        <label className="text-[#8C8C8C] font-semibold mt-8 ">
          Copyright © [2024] DHope Nation. <br /> All rights reserved.
        </label>
      </div>
    </div>
  );
}

export default CreateAccount1;
