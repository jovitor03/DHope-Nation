import "/Users/jovitor/Desktop/dhope-nation/dhope-nation/src/styles/Account.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

function CreateAccount3() {
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
        <div className="text-left">
          <button className="btn btn-primary bg-white border-2 border-[#34A77F] text-[#34A77F] rounded-md text-lg hover:bg-[#ebebeb] hover:border-[#34A77F] mt-8 w-[10vw]">
            Insert file...
          </button>
          <label className="text-lg ml-4">7d4-d7a-405-a7-53e77.png</label>
        </div>
        <div className="flex flex-row justify-between">
          <Link
            to="/create-account/page-2"
            className="btn btn-primary bg-white border-2 border-[#34A77F] text-[#34A77F] rounded-md text-lg hover:bg-[#ebebeb] hover:border-[#34A77F] mt-8 w-[12vw]"
          >
            <button>Go Back</button>
          </Link>
          <Link
            to="/login"
            className="btn btn-primary bg-[#34A77F] border-[#34A77F] text-white rounded-md text-lg hover:bg-[#2e8063] mt-8 w-[12vw]"
          >
            <button>Sign Up</button>
          </Link>
        </div>
        <label className="text-[#8C8C8C] font-semibold mt-8 ">
          Copyright © [2024] DHope Nation. <br /> All rights reserved.
        </label>
      </div>
    </div>
  );
}

export default CreateAccount3;
