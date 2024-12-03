import React from "react";

const LevelBorder = ({ level }) => {
  const getLevelBorderColor = (level) => {
    if (level >= 0 && level <= 9) return "#FFF584";
    if (level >= 10 && level <= 24) return "#84FF8A";
    if (level >= 25 && level <= 49) return "#FF8494";
    if (level >= 50 && level <= 99) return "#9F84FF";
    return "#84F1FF";
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ borderColor: getLevelBorderColor(level), borderWidth: "2px" }}
    >
      <span className="text-2xl font-bold text-white">{level}</span>
    </div>
  );
};

export default LevelBorder;