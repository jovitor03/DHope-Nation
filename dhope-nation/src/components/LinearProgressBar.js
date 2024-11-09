import React from "react";

function LinearProgressBar({ width = 250, height = 25, fillColor }) {
  const progress = 68;

  const progressWidth = (width * progress) / 100;

  return (
    <svg width={width} height={height}>
      {/* Fundo da barra de progresso */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="#BEBEBE"
        rx="14" // Arredondamento dos cantos (opcional)
      />
      <rect
        x="0"
        y="0"
        width={progressWidth}
        height={height}
        fill={fillColor}
        rx="14" // Arredondamento dos cantos (opcional)
        style={{ transition: "width 0.1s ease-in-out" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1em"
        fill="#fff"
        fontWeight={600}
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

export default LinearProgressBar;
