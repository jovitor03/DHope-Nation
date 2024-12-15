import React from 'react';
import "../styles/LoadingScreen.css";

const LoadingScreen = () => {
    return (
        <div className="loading-screen bg-[#A0C0A2] flex flex-col">
            <div className="spinner"></div>
            <label className="text-[#4E6A56] mt-6 text-4xl font-semibold">Loading...</label>
        </div>
    );
};

export default LoadingScreen;