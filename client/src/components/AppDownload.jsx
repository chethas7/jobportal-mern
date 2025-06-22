import React from "react";
import { assets } from "../assets/assets";

const AppDownload = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto my-20">
      <div className="relative bg-gradient-to-r from-purple-100 via-violet-50 to-purple-50 p-12 sm:p-24 lg:p-32">
        <div>
          <h1 className="text-2xl  sm:text-4xl font-bold mb-8 max-w-md">
            Download Mobile App for Better Experience
          </h1>
          <div className="flex gap-4">
            <a
              href="https://play.google.com/store/games?hl=en&pli=1"
              className="inline-block"
            >
              <img className="h-12" src={assets.play_store} alt="" />
            </a>
            <a
              href="https://www.apple.com/in/app-store/"
              className="inline-block"
            >
              <img className="h-22" src={assets.app_store} alt="" />
            </a>
          </div>
        </div>
        <img
          className="absolute w-80 right-0 bottom-0 mr-45 max-lg:hidden"
          src={assets.app_main_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default AppDownload;
