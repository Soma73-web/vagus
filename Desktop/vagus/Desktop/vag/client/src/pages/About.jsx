import React from "react";
import {
  FaChartLine,
  FaCoins,
  FaLightbulb,
  FaRocket,
  FaHandshake,
  FaCogs,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-[96px]">
      {/* Page Header - Just below nav bar */}
      <h2 className="text-3xl font-bold text-center mb-10 text-indigo-800 pt-6">
        About Us
      </h2>

      <section id="about" className="pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Section */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            {/* Text and Icons */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                We believe in doing the right thing
              </h3>
              <p className="text-gray-600 mb-6">
                Foster a supportive and inclusive environment where our team can
                thrive. We believe in doing the right things, always.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaChartLine className="text-blue-600" />
                    <h4 className="text-sm font-semibold text-gray-800">
                      Growth
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Our mission is to drive growth & improve progress.
                  </p>
                </div>

                <div className="bg-gray-100 rounded p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaCoins className="text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-800">
                      Revenue
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Our mission is to grow & improve sustainability.
                  </p>
                </div>
              </div>
            </div>

            {/* Image or YouTube Embed */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/uQzFihB5-B4"
                title="Director's Message"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Bottom Card Grid */}
          <div className="text-center mb-8">
            <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full inline-block">
              Our Services
            </span>
            <h2 className="text-2xl font-bold mt-2">Unleash Your Potential</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              About Us section typically appears on a company or organization's
              website and provides visitors with key information about the
              entity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaLightbulb className="text-indigo-600 text-xl" />,
                title: "Creative Thinking",
                desc: "We nurture problem-solving and new ideas through critical thinking.",
              },
              {
                icon: <FaRocket className="text-pink-500 text-xl" />,
                title: "Innovation",
                desc: "Empowering students through innovative methods and digital tools.",
              },
              {
                icon: <FaHandshake className="text-green-500 text-xl" />,
                title: "Integrity",
                desc: "Trust, honesty and responsibility in everything we do.",
              },
              {
                icon: <FaCogs className="text-yellow-500 text-xl" />,
                title: "Operational Excellence",
                desc: "Systematic processes that ensure results and consistency.",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-3">{card.icon}</div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {card.title}
                </h4>
                <p className="text-sm text-gray-600">{card.desc}</p>
                <button
                  type="button"
                  className="text-indigo-600 text-sm mt-3 inline-block hover:text-indigo-800 transition-colors"
                >
                  Read more →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
