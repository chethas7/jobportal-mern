import React from "react";
import { assets } from "../assets/assets";

const TrustedBrands = () => {
  return (
    <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 flex">
      <div className="flex justify-center gap-10 lg:gap-16 flex-wrap">
        <p className="font-medium">Trusted By</p>
        <img className="h-6" src={assets.adobe_logo} alt="" />
        <img className="h-6" src={assets.amazon_logo} alt="" />
        <img className="h-6" src={assets.samsung_logo} alt="" />
        <img className="h-6" src={assets.walmart_logo} alt="" />
        <img className="h-6" src={assets.accenture_logo} alt="" />
        <img className="h-6" src={assets.microsoft_logo} alt="" />
      </div>
    </div>
  );
};

export default TrustedBrands;
