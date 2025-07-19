import React from "react";
import HomeSlider from "../components/HomeSlider";
import Hero from "../components/Hero";
import Courses from "../components/Courses";
import Features from "../components/Features";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
// import DownloadSection from '../components/DownloadSection';
import Footer from "../components/Footer";
import ResultsPage from "./ResultsPage";

const HomePage = () => {
  // Removed automatic scroll logic that was causing unwanted gallery scrolling

  return (
    <>
      <main className="pt-[96px]">
        <div className="mb-10">
          <HomeSlider />
        </div>

        <div className="mb-16">
          <Hero />
        </div>

        <div className="mb-16">
          <Courses />
        </div>

        <div className="mb-16">
          <Features />
        </div>

        <div className="mb-16">
          <ResultsPage />
        </div>

        <div className="mb-16">
          <Gallery />
        </div>

        <div className="mb-16">
          <Testimonials />
        </div>

        {/* <div className="mb-16">
          <DownloadSection />
        </div> */}
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
