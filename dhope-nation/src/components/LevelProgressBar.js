import React, { useRef, useState, useEffect } from "react";

function LinearProgressBar({
  width,
  height,
  fillColor,
  xp,
  xpToNextLevel,
  radius,
}) {
  const barRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(width);

  useEffect(() => {
    if (barRef.current) {
      setContainerWidth(barRef.current.clientWidth);
    }

    const handleResize = () => {
      if (barRef.current) {
        setContainerWidth(barRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  const progress = xpToNextLevel === 0 ? 0 : (xp / xpToNextLevel) * 100;
  const progressWidth = (containerWidth * progress) / 100;

  return (
    <svg ref={barRef} width={width} height={height}>
      <rect
        x="0"
        y="0"
        width="100%"
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
        rx={radius}
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
