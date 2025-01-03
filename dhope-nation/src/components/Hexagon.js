const Hexagon = ({ fillColor, width, height }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 0L15 4V12L8 16L1 12V4L8 0Z" fill={fillColor} />
    </svg>
  );
  
  export default Hexagon;
  