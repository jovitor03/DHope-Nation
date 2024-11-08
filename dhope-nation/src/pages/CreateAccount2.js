import "../styles/CreateAccount.css";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { register } from "../api/Accounts";

function CreateAccount2() {
  const location = useLocation();
  const { name, surname, email } = location.state || {};
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const data = {
        first_name: name,
        last_name: surname,
        email: email,
        username,
        password,
      };
      await register(data);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error creating account: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login text-black">
      <div className="flex flex-col align-middle bg-[#F7FFFD] rounded-[50px] text-center p-12 w-1/3  2xl:w-[30vw] h-auto mx-auto relative transform 2xl:scale-[1.2] mt-16">
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
          Username<span className="text-[#FF0000]">*</span>
        </label>
        <input
          type="text"
          className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg px-4 focus:outline-none focus:border-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="text-left font-bold text-lg mt-4">
          Password<span className="text-[#FF0000]">*</span>
        </label>
        <input
          type="password"
          className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg px-4 focus:outline-none focus:border-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex flex-row justify-between">
          <Link
            to="/create-account/page-1"
            className="btn btn-primary bg-white border-2 border-[#34A77F] text-[#34A77F] rounded-md text-lg hover:bg-[#ebebeb] hover:border-[#34A77F] mt-8 w-[12vw]"
          >
            <button>Go Back</button>
          </Link>
          <button onClick={handleSignUp} className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg hover:bg-[#2e8063] mt-8 w-[12vw]">
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

export default CreateAccount2;
