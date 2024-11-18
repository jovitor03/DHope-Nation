import React from "react";

function LinearProgressBar({
  width,
  height,
  fillColor,
  xp,
  xpToNextLevel,
  minXpLevel,
  radius,
}) {
  const progress = xpToNextLevel === 0 ? 0 : (xp / xpToNextLevel) * 100;

  const progressWidth = (width * progress) / 100;

  return (
    <svg width={width} height={height}>
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="#BEBEBE"
        rx={radius}
      />
      <rect
        x="0"
        y="0"
        width={progressWidth}
        height={height}
        fill={fillColor}
        rx="14"
        style={{ transition: "width 0.1s ease-in-out" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1em"
        fill="#000"
        fontWeight={600}
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

export default LinearProgressBar;
