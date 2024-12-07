import React from "react";
import honorIcon from "../assets/images/medal.png";
import rankUpIcon from "../assets/images/rank-up.png";
import xpIcon from "../assets/images/xp.png";
import donationIcon from "../assets/images/donated.png";
import crossIcon from "../assets/images/red-cross.png";

const Notification = ({ notifications }) => {
  const typeImages = {
    honor: honorIcon,
    level: rankUpIcon,
    xp: xpIcon,
    donation: donationIcon,
    error: crossIcon,
  };

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`p-4 mb-2 rounded text-white transition-opacity duration-500 bg-green-800 text-xl ${
            notification.message ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center">
            <img
              src={typeImages[notification.type]}
              alt={notification.type}
              className="w-6 h-6 mr-2"
            />
            <span>{notification.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
