import "../../styles/Account.css";
import logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../api/Accounts";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = { username, password };
      const response = await login(data);

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        alert("Login successful!");
        navigate("/profile");
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="account-page text-black">
      <div className="flex flex-col align-middle bg-[#F7FFFD] rounded-[50px] text-center p-12 w-1/3 2xl:w-[30vw] h-auto mx-auto relative 2xl:scale-[1.2] mt-16">
        <img
          src={logo}
          alt="logo"
          className="w-2/5 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <h1 className="text-4xl font-bold mt-12">Login</h1>
        <label className="text-lg mt-4">
          Don't have an account?{" "}
          <Link
            to="/create-account/page-1"
            className="text-[#809F8B] underline underline-offset-2 font-bold"
          >
            Create new account
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
        <button
          onClick={handleLogin}
          className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg hover:bg-[#2e8063] mt-8 "
        >
          Log In
        </button>
        <label className="text-[#8C8C8C] font-semibold mt-8">
          Copyright © [2024] DHope Nation. <br /> All rights reserved.
        </label>
      </div>
    </div>
  );
}

export default Login;