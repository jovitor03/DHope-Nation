import "../styles/CreateAccount1.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function CreateAccount1() {
  return (
    <div className="login text-black">
      <div className="flex flex-col align-middle bg-[#F7FFFD] rounded-[50px] text-center p-12 w-1/3 h-auto mx-auto relative transform 2xl:scale-[1.2] 2xl:w-1/3 mt-16">
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
            />
            <label className="text-left text-lg mt-0 ml-2">Donator</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="userType"
              className="appearance-none w-5 h-5 bg-white border-2 rounded-full relative border-gray-400"
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
            />
          </div>
          <div className="flex flex-col text-left ml-4">
            <label className="font-bold text-lg">
              Surname<span className="text-[#FF0000]">*</span>
            </label>
            <input
              type="text"
              className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg px-4 focus:outline-none focus:border-black w-[12vw]"
            />
          </div>
        </div>
        <label className="text-left font-bold text-lg mt-4">
          Email<span className="text-[#FF0000]">*</span>
        </label>
        <input
          type="text"
          className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg px-4 focus:outline-none focus:border-black"
        />
        <Link
          to="/create-account/page-2"
          className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg hover:bg-[#2e8063] mt-8"
        >
          <button>Next</button>
        </Link>
        <label className="text-[#8C8C8C] font-semibold mt-8 ">
          Copyright © [2024] DHope Nation. <br /> All rights reserved.
        </label>
      </div>
    </div>
  );
}

export default CreateAccount1;
