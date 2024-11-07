import "../styles/CreateAccount1.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function CreateAccount1() {
  return (
    <div className="login text-black">
      <div className="flex flex-col align-middle bg-[#F7FFFD] rounded-[50px] text-center p-12 w-1/3 h-auto 2xl:h-[75vh] mx-auto mt-16 relative">
        <img
          src={logo}
          alt="logo"
          className="w-2/5 2xl:w-[33vh] mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <h1 className="text-5xl font-bold mt-8 2xl:mt-16 2xl:text-[64px]">
          Create your account
        </h1>
        <label className="text-lg 2xl:text-2xl mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#809F8B] underline underline-offset-2 font-bold"
          >
            Sign In
          </Link>
        </label>
        <label className="text-left font-bold text-lg 2xl:text-2xl mt-6">
          Account Type<span className="text-[#FF0000]">*</span>
        </label>
        <div className="flex flex-row w-full gap-6">
          <div className="flex items-center">
            <input
              type="radio"
              name="userType"
              className="appearance-none w-5 h-5 bg-white border-2 rounded-full relative border-gray-400"
            />
            <label className="text-left text-lg 2xl:text-2xl mt-0 ml-2">
              Donator
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="userType"
              className="appearance-none w-5 h-5 bg-white border-2 rounded-full relative border-gray-400"
            />
            <label className="text-left text-lg 2xl:text-2xl mt-0 ml-2">
              Campaign Creator
            </label>
          </div>
        </div>
        <div className="flex flex-row mt-4">
          <div className="text-left">
            <label className="text-left font-bold text-lg 2xl:text-2xl">
              Name<span className="text-[#FF0000]">*</span>
            </label>
            <input
              type="text"
              className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg 2xl:text-xl px-4 focus:outline-none focus:border-black 2xl:h-[7vh] w-[12vw]"
            />
          </div>
          <div className="text-left">
            <label className="text-left font-bold text-lg 2xl:text-2xl">
              Surname<span className="text-[#FF0000]">*</span>
            </label>
            <input
              type="text"
              className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg 2xl:text-xl px-4 focus:outline-none focus:border-black 2xl:h-[7vh] w-[12vw] ml-auto block"
            />
          </div>
        </div>
        <label className="text-left font-bold text-lg 2xl:text-2xl mt-4">
          Email<span className="text-[#FF0000]">*</span>
        </label>
        <input
          type="text"
          className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg 2xl:text-xl px-4 focus:outline-none focus:border-black 2xl:h-[7vh]"
        />
        <button className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg 2xl:text-2xl hover:bg-[#2e8063] mt-8 2xl:h-[7vh]">
          Next
        </button>
        <label className="text-[#8C8C8C] font-semibold mt-8 2xl:text-xl">
          Copyright © [2024] DHope Nation. <br /> All rights reserved.
        </label>
      </div>
    </div>
  );
}

export default CreateAccount1;
