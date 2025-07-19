import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("neet");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    // Simulate loading and then show cards with staggered animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Animate cards in sequence
      courses[activeTab].forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index]);
        }, index * 100);
      });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reset animations when tab changes
    setVisibleCards([]);
    courses[activeTab].forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index]);
      }, index * 100);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const courses = {
    neet: [
      {
        title: "NEET – Two Year Premier Course",
        features: [
          "Starts From July 2025",
          "For 11th-Grade Students",
          "15+ Hours Of Weekly (Offline Classes)",
          "Online Supportive Classes",
          "Topic-Wise Full Syllabus Notes",
          "Regular Assessment & Test Prep",
        ],
      },
      {
        title: "NEET – One Year Premier Course",
        features: [
          "Starts From June 2025",
          "For 12th-Grade Students",
          "15+ Hours Of Weekly (Offline Classes)",
          "Online Supportive Classes",
          "Topic-Wise Full Syllabus Notes",
          "Regular Assessment & Test Prep",
        ],
      },
      {
        title: "NEET Crash Course",
        features: [
          "Starts From March 2025",
          "One Month Of Intensive Coaching",
          "54+ Hours Of Weekly (Online/Offline Classes)",
          "Live Doubt Clearing Session",
          "Online Supportive Classes",
          "Regular Assessment & Test Prep",
        ],
      },
      {
        title: "NEET Repeater Course",
        features: [
          "Starts From June 2025",
          "For Post-12th Graders To Excel In The Coming Year’s NEET",
          "38+ Hours Of Weekly (Online/Offline Classes)",
          "Live Doubt Clearing Session",
          "Online Supportive Classes",
          "Topic-Wise Full Syllabus Notes",
          "Regular Assessment & Test Prep",
        ],
      },
    ],
    jee: [
      { title: "JEE – Main Course", features: ["Details coming soon..."] },
      { title: "JEE – Advanced Course", features: ["Details coming soon..."] },
    ],
    foundation: [
      {
        title: "Foundation for Class 8",
        features: ["Basics of Science & Math", "Early NEET/JEE concepts"],
      },
      {
        title: "Foundation for Class 9 & 10",
        features: ["Physics, Chemistry, Math, Biology", "Olympiad Coaching"],
      },
    ],
  };

  if (isLoading) {
    return (
      <section
        id="courses"
        className="pt-28 pb-16 bg-gradient-to-b from-white to-indigo-50 scroll-mt-24"
      >
        <div className="container-responsive">
          <LoadingSpinner
            size="large"
            message="Preparing Sacred Knowledge..."
            divine={true}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      id="courses"
      className="pt-28 pb-16 bg-gradient-to-b from-white to-indigo-50 scroll-mt-24"
    >
      <div className="container-responsive">
        {/* Enhanced Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-px bg-indigo-500"></div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Our Courses
            </p>
            <div className="w-16 h-px bg-indigo-500"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 leading-tight">
            Achieve Your <span className="gradient-text">NEET</span> Dream With
            <br className="hidden md:block" />
            Tailored Courses
          </h2>
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our courses are crafted by NEET experts to ensure thorough
            understanding and mastery of every topic. Join us and take a
            confident step towards your medical career.
          </p>
          <div className="section-divider mt-6"></div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-12 animate-slide-up">
          <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
            <div className="flex gap-2">
              {["neet", "jee", "foundation"].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {tab === "neet"
                    ? "NEET Courses"
                    : tab === "jee"
                      ? "JEE Courses"
                      : "Foundation Courses"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {courses[activeTab].map((course, idx) => (
            <div
              key={idx}
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 flex flex-col justify-between transition-all duration-500 transform ${
                visibleCards.includes(idx)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } hover:scale-105 hover:-translate-y-2`}
              style={{
                animationDelay: `${idx * 100}ms`,
                minHeight: "420px",
              }}
            >
              {/* Course Header */}
              <div>
                <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 group-hover:text-indigo-700 transition-colors leading-tight">
                  {course.title}
                </h3>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {course.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
                    >
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link
                to="/contact"
                className="btn-primary text-center text-sm font-semibold group-hover:from-purple-600 group-hover:to-indigo-600"
              >
                ENQUIRE NOW
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
