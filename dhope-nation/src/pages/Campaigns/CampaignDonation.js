// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getCampaignById, donateToCampaign } from "../../api/Campaign";
// import "../../styles/Campaigns.css";
// import Layout from "../../layouts/DonatorLayout.js";

// function CampaignDonation() {
//   const [campaign, setCampaign] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [donationAmount, setDonationAmount] = useState("");
//   const [itemsProvided, setItemsProvided] = useState(0);
//   const { id: campaignId } = useParams();
//   const navigate = useNavigate();

//   function generateLevelThresholds(maxLevel) {
//     const thresholds = [];
//     let xp = 0;
//     let xpIncrement = 100;

//     for (let level = 1; level <= maxLevel; level++) {
//       thresholds.push({ level, xp });
//       xp += xpIncrement * level;
//     }

//     return thresholds;
//   }

//   function calculateLevel(xp, levelThresholds) {
//     for (let i = levelThresholds.length - 1; i >= 0; i--) {
//       if (xp >= levelThresholds[i].xp) {
//         return levelThresholds[i].level;
//       }
//     }
//     return 1;
//   }

//   const levelThresholds = generateLevelThresholds(999);

//   useEffect(() => {
//     const fetchCampaign = async () => {
//       try {
//         const data = await getCampaignById(
//           campaignId,
//           localStorage.getItem("authToken")
//         );
//         if (!data) {
//           navigate("/campaigns");
//         } else {
//           setCampaign(data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch campaign data:", error);
//         navigate("/campaigns");
//       }
//     };

//     fetchCampaign();
//   }, [campaignId, navigate]);

//   const handlePaymentMethodChange = (event) => {
//     setPaymentMethod(event.target.value);
//   };

//   const handleDonationAmountChange = (event) => {
//     const amount = parseFloat(event.target.value) || 0;
//     setDonationAmount(event.target.value);

//     if (campaign && campaign.ratio) {
//       const items = amount * campaign.ratio;
//       setItemsProvided(Math.round(items));
//     }
//   };

//   const handleConfirmDonation = async () => {
//     const amount = parseFloat(donationAmount);

//     if (!amount || amount <= 0) {
//       alert("Please enter a valid donation amount.");
//       return;
//     }

//     if (!paymentMethod) {
//       alert("Please select a payment method.");
//       return;
//     }

//     try {
//       await donateToCampaign(
//         {
//           campaign_id: campaignId,
//           amount,
//           payment_method: paymentMethod,
//           items_provided: itemsProvided,
//         },
//         localStorage.getItem("authToken")
//       );

//       alert(`Donation successful! XP Gained: ${amount * 10}`);
//       navigate(`/campaign/${campaignId}`);
//     } catch (error) {
//       console.error("Donation failed:", error);
//       alert("Failed to process your donation.");
//     }
//   };

//   if (!campaign) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Layout>
//       <div className="flex flex-row justify-center mt-[-20px]">
//         <h1 className="text-3xl 2xl:text-4xl text-[#28372C] font-semibold">
//           {campaign.title}
//         </h1>
//       </div>
//       <div className="flex flex-row justify-center ml-10 mr-8 mt-8">
//         <div className="flex flex-col w-1/2 gap-2">
//           <div className="w-full bg-white flex flex-col items-center border border-[#28372C]">
//             <label className="text-[#28372C] font-semibold text-3xl mt-6">
//               Your donation
//             </label>
//             <div>
//               <label
//                 htmlFor="payment-method"
//                 className="text-[#28372C] text-xl"
//               >
//                 Payment method:
//               </label>
//               <select
//                 id="payment-method"
//                 value={paymentMethod}
//                 onChange={handlePaymentMethodChange}
//                 className="p-2 border bg-[#4A6B53] border-gray-300 rounded-md ml-2 w-[200px] mt-4 text-white text-xl"
//               >
//                 <option value="" disabled>
//                   Select a method
//                 </option>
//                 <option value="credit-card">Credit Card</option>
//                 <option value="paypal">PayPal</option>
//                 <option value="bank-transfer">Bank Transfer</option>
//                 <option value="multibanco">Multibanco</option>
//                 <option value="mbway">MB Way</option>
//               </select>
//             </div>
//             <div>
//               <label className="text-[#28372C] text-xl">Amount:</label>
//               <input
//                 type="number"
//                 value={donationAmount}
//                 className="p-2 border bg-[#4A6B53] border-gray-300 rounded-md ml-2 w-[200px] mt-4 text-white custom-number-input placeholder-gray-400 text-center text-xl focus:outline-none"
//                 placeholder="0.50€ - 100000€"
//                 onChange={handleDonationAmountChange}
//               ></input>
//             </div>
//             {campaign.ratio && (
//               <div className="mt-4">
//                 <p className="text-[#28372C] text-xl font-semibold">
//                   Your contribution will provide {itemsProvided}{" "}
//                   {campaign.sentence}.
//                 </p>
//               </div>
//             )}
//             <div className="mb-6 mt-6 flex flex-row justify-between space-x-4">
//               <button
//                 className="h-12 px-4 border-2 rounded-sm border-[#4A6B53] bg-[#D9D9D9] text-[#4A6B53] text-2xl font-semibold shadow-y whitespace-nowrap"
//                 onClick={() => navigate(`/campaign/${campaignId}`)}
//               >
//                 CANCEL
//               </button>
//               <button
//                 className="h-12 px-4 border-2 rounded-sm border-white bg-[#4A6B53] text-white text-2xl font-semibold shadow-y whitespace-nowrap"
//                 onClick={handleConfirmDonation}
//               >
//                 CONFIRM DONATION
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default CampaignDonation;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCampaignById, donateToCampaign } from "../../api/Campaign";
import "../../styles/Campaigns.css";
import Layout from "../../layouts/DonatorLayout.js";

function CampaignDonation() {
  const [campaign, setCampaign] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [itemsProvided, setItemsProvided] = useState(0);
  const [userXP, setUserXP] = useState(0); // Estado para armazenar o XP do usuário
  const { id: campaignId } = useParams();
  const navigate = useNavigate();

  function generateLevelThresholds(maxLevel) {
    const thresholds = [];
    let xp = 0;
    let xpIncrement = 100;

    for (let level = 1; level <= maxLevel; level++) {
      thresholds.push({ level, xp });
      xp += xpIncrement * level;
    }

    return thresholds;
  }

  function calculateLevel(xp, levelThresholds) {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (xp >= levelThresholds[i].xp) {
        return levelThresholds[i].level;
      }
    }
    return 1;
  }

  const levelThresholds = generateLevelThresholds(999);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await getCampaignById(
          campaignId,
          localStorage.getItem("authToken")
        );
        if (!data) {
          navigate("/campaigns");
        } else {
          setCampaign(data);
        }
      } catch (error) {
        console.error("Failed to fetch campaign data:", error);
        navigate("/campaigns");
      }
    };

    fetchCampaign();
  }, [campaignId, navigate]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleDonationAmountChange = (event) => {
    const amount = parseFloat(event.target.value) || 0;
    setDonationAmount(event.target.value);

    if (campaign && campaign.ratio) {
      const items = amount * campaign.ratio;
      setItemsProvided(Math.round(items));
    }
  };

  const handleConfirmDonation = async () => {
    const amount = parseFloat(donationAmount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const xpGained = amount * 10;
      setUserXP(userXP + xpGained);

      const newLevel = calculateLevel(userXP + xpGained, levelThresholds);

      alert(
        `Donation successful! XP Gained: ${xpGained}. Your new level is ${newLevel}.`
      );

      await donateToCampaign(
        {
          campaign_id: campaignId,
          amount,
          payment_method: paymentMethod,
          items_provided: itemsProvided,
        },
        localStorage.getItem("authToken")
      );

      navigate(`/campaign/${campaignId}`);
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Failed to process your donation.");
    }
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
                value={donationAmount}
                className="p-2 border bg-[#4A6B53] border-gray-300 rounded-md ml-2 w-[200px] mt-4 text-white custom-number-input placeholder-gray-400 text-center text-xl focus:outline-none"
                placeholder="0.50€ - 100000€"
                onChange={handleDonationAmountChange}
              ></input>
            </div>
            {campaign.ratio && (
              <div className="mt-4">
                <p className="text-[#28372C] text-xl font-semibold">
                  Your contribution will provide {itemsProvided}{" "}
                  {campaign.sentence}.
                </p>
              </div>
            )}
            <div className="mb-6 mt-6 flex flex-row justify-between space-x-4">
              <button
                className="h-12 px-4 border-2 rounded-sm border-[#4A6B53] bg-[#D9D9D9] text-[#4A6B53] text-2xl font-semibold shadow-y whitespace-nowrap"
                onClick={() => navigate(`/campaign/${campaignId}`)}
              >
                CANCEL
              </button>
              <button
                className="h-12 px-4 border-2 rounded-sm border-white bg-[#4A6B53] text-white text-2xl font-semibold shadow-y whitespace-nowrap"
                onClick={handleConfirmDonation}
              >
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
