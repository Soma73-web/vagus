import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initScrollManagement } from "./utils/scrollManagement";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import WhatsAppFloat from "./components/WhatsAppFloat";
import PageTransition from "./components/PageTransition";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import InitialLoader from "./components/InitialLoader";

// Homepage Components
import HomeSlider from "./components/HomeSlider";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import Features from "./components/Features";
import Results from "./components/Results";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";

// Other Pages
import GallerySection from "./components/GallerySection";
import DownloadSection from "./components/DownloadSection";
import DirectorsMessage from "./pages/DirectorsMessage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactPage from "./pages/ContactPage";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About";
import ResultsPage from "./pages/ResultsPage";

function App() {
  useEffect(() => {
    // Initialize scroll management on app start
    initScrollManagement();

    // Additional safety measure - ensure we start at top
    const resetScroll = () => {
      if (window.location.hash === "" || window.location.pathname !== "/") {
        window.scrollTo(0, 0);
      }
    };

    // Run immediately and after a short delay
    resetScroll();
    setTimeout(resetScroll, 100);
  }, []);

  return (
    <InitialLoader>
      <Router>
        <ScrollToHash />
        <ScrollProgress />
        <Header />

        {/* Floating Action Buttons - Available on all pages */}
        <WhatsAppFloat />
        <BackToTop />

        <PageTransition>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <main className="pt-[96px] bg-gradient-to-b from-gray-50 to-white">
                    <HomeSlider />
                    <Hero />

                    {/* Courses Section */}
                    <div id="courses">
                      <Courses />
                    </div>

                    <Features />
                    <Results />
                    <Gallery />

                    {/* Testimonials Section */}
                    <div id="testimonials">
                      <Testimonials />
                    </div>
                  </main>
                  <Footer />
                </>
              }
            />

            {/* Other Pages with enhanced layouts */}
            <Route path="/gallery" element={<GallerySection />} />
            <Route path="/downloads" element={<DownloadSection />} />
            <Route
              path="/directors-message"
              element={
                <>
                  <DirectorsMessage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <div className="pt-[96px] min-h-screen bg-gradient-to-b from-gray-50 to-white">
                  <PrivacyPolicy />
                  <Footer />
                </div>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <ContactPage />
                  <Footer />
                </>
              }
            />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/about"
              element={
                <>
                  <About />
                  <Footer />
                </>
              }
            />
            <Route
              path="/results"
              element={
                <div className="pt-[96px] min-h-screen bg-gradient-to-b from-gray-50 to-white">
                  <ResultsPage />
                  <Footer />
                </div>
              }
            />
          </Routes>
        </PageTransition>
      </Router>
    </InitialLoader>
  );
}

export default App;
