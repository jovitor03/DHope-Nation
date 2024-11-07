import "../styles/Login.css";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="login text-black">
      <div className="flex flex-col align-middle bg-[#F7FFFD] rounded-[50px] text-center p-12 w-1/3 h-auto 2xl:h-[75vh] mx-auto mt-16 relative">
        <img
          src={logo}
          alt="logo"
          className="w-2/5 2xl:w-[33vh] mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <h1 className="text-5xl font-bold mt-8 2xl:mt-16 2xl:text-[64px]">
          Login
        </h1>
        <label className="text-lg 2xl:text-2xl mt-4">
          Don't have an account?{" "}
          <Link to="/create-account" className="text-[#809F8B] underline underline-offset-2 font-bold">
            Create new account
          </Link>
        </label>
        <label className="text-left font-bold text-lg 2xl:text-2xl mt-6">
          Username<span className="text-[#FF0000]">*</span>
        </label>
        <input
          type="text"
          className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg 2xl:text-xl px-4 focus:outline-none focus:border-black 2xl:h-[7vh]"
        />
        <label className="text-left font-bold text-lg 2xl:text-2xl mt-4">
          Password<span className="text-[#FF0000]">*</span>
        </label>
        <input
          type="password"
          className="rounded-md bg-white border border-[#AFAFAF] h-12 text-lg 2xl:text-xl px-4 focus:outline-none focus:border-black 2xl:h-[7vh]"
        />
        <button className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg 2xl:text-2xl hover:bg-[#2e8063] mt-8 2xl:h-[7vh]">
          Log In
        </button>
        <label className="text-[#8C8C8C] font-semibold mt-8 2xl:text-xl">
          Copyright © [2024] DHope Nation. <br /> All rights reserved.
        </label>
      </div>
    </div>
  );
}

export default Login;
