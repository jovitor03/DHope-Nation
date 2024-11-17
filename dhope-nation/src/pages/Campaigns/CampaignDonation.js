import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCampaignById } from "../../api/Campaign";
import "../../styles/Campaigns.css";
import Layout from "../../layouts/DonatorLayout.js";

function CampaignDonation() {
  const [campaign, setCampaign] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { id: campaignId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaign = async () => {
      const data = await getCampaignById(
        campaignId,
        localStorage.getItem("authToken")
      );
      if (!data) {
        navigate("/campaigns");
      } else {
        setCampaign(data);
      }
    };

    fetchCampaign();
  }, [campaignId, navigate]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex flex-row justify-center mt-[-20px]">
        <h1 className="text-3xl 2xl:text-4xl text-[#28372C] font-semibold">
          {campaign.title}
        </h1>
      </div>
      <div className="flex flex-row justify-center ml-10 mr-8 mt-8">
        <div className="flex flex-col w-1/2 gap-2">
          <div className="w-full bg-white flex flex-col items-center border border-[#28372C]">
            <label className="text-[#28372C] font-semibold text-3xl mt-6">
              Your donation
            </label>
            <div>
              <label
                htmlFor="payment-method"
                className="text-[#28372C] text-xl"
              >
                Payment method:
              </label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                className="p-2 border bg-[#4A6B53] border-gray-300 rounded-md ml-2 w-[200px] mt-4 text-white text-xl"
              >
                <option value="" disabled>
                  Select a method
                </option>
                <option value="credit-card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="multibanco">Multibanco</option>
                <option value="mbway">MB Way</option>
              </select>
            </div>
            <div>
              <label className="text-[#28372C] text-xl">Amount:</label>
              <input
                type="number"
                className="p-2 border bg-[#4A6B53] border-gray-300 rounded-md ml-2 w-[200px] mt-4 text-white custom-number-input placeholder-gray-400 text-center text-xl focus:outline-none"
                placeholder="0,50€ - 100000€"
              ></input>
            </div>
            <div className="mb-6 mt-6 w-1/2 justify-center flex flex-row space-x-12">
              <button
                className="flex-grow h-12 w-6/12 border-2 rounded-sm border-[#4A6B53] bg-[#D9D9D9] text-[#4A6B53] text-2xl font-semibold shadow-y"
                onClick={() => navigate(`/campaign/${campaignId}`)}
              >
                CANCEL
              </button>
              <button className="flex-grow h-12 w-10/12 border-2 rounded-sm border-white bg-[#4A6B53] text-white text-2xl font-semibold shadow-y">
                CONFIRM DONATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CampaignDonation;
