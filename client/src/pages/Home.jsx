import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import TrustedBrands from "../components/TrustedBrands";
import JobListing from "../components/JobListing";
import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <TrustedBrands />
      <JobListing />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;
