import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SiteLoader from "./components/SiteLoader";
import ErrorBoundary from "./components/ErrorBoundary";
import authManager from "./utils/auth";
import PopupWrapper from "./components/PopupWrapper";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import WhatsAppButton from "./components/WhatsAppButton";
import AIChatbot from "./components/AIChatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";

// Homepage Components
import HomeSlider from "./components/HomeSlider";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import Features from "./components/Features";
import Results from "./components/Results";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Events from "./components/Events";

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
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup auth manager interceptors
    authManager.setupAxiosInterceptors();

    // Optimize loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SiteLoader />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ScrollToHash />
        <BackToTop />
        {/* Only show public UI on non-admin pages */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <WhatsAppButton />
                <AIChatbot />
                <main className="pt-[96px]">
                  <HomeSlider />
                  {/* <Events /> removed as per user request */}
                  <Hero />
                  {/* Courses Section */}
                  <div id="courses" className="scroll-mt-24">
                    <Courses />
                  </div>
                  <Features />
                  <Results />
                  <Gallery />
                  {/* Testimonials Section */}
                  <div id="testimonials" className="scroll-mt-24">
                    <Testimonials />
                  </div>
                </main>
                <Footer />
              </>
            }
          />

          {/* Other Pages */}
          <Route path="/gallery" element={<><Header /><GallerySection /><Footer /></>} />
          <Route path="/downloads" element={<><Header /><DownloadSection /><Footer /></>} />
          <Route path="/directors-message" element={<><Header /><DirectorsMessage /><Footer /></>} />
          <Route path="/privacy-policy" element={<><Header /><PrivacyPolicy /><Footer /></>} />
          <Route path="/contact" element={<><Header /><ContactPage /><Footer /></>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/about" element={<><Header /><About /><Footer /></>} />
          <Route path="/results" element={<><Header /><ResultsPage /><Footer /></>} />
          <Route path="/student-login" element={<><Header /><StudentLogin /><Footer /></>} />
          <Route path="/student-dashboard" element={<><Header /><StudentDashboard /><Footer /></>} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
