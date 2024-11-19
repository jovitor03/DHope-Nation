// import axios from "axios";
// import { useEffect } from "react";

// const CampaignSearch = () => {
//   const fetchCampaigns = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         "http://127.0.0.1:8000/get_all_campaigns/",
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//             Accept: "*/*",
//           },
//         }
//       );
//     } catch (error) {
//       console.error("Erro ao buscar campanhas:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   return <div></div>;
// };

// export default CampaignSearch;
