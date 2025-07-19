import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/logoo.jpg';

const Hero = () => {
  return (
    <section className="min-h-[85vh] flex items-center pt-24 pb-12 px-6 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Bring Your <span className="text-indigo-600 underline">NEET Vision</span> to Life<br />
            with <span className="text-indigo-600 underline">Expert Mentorship</span>
          </h1>
          <p className="text-lg text-gray-600">
            Join the ranks of top achievers with structured coaching,
            proven strategies, and expert guidance.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-indigo-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition duration-300"
          >
            Enquire Now →
          </Link>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={heroImage}
            alt="Students learning at NEET Academy"
            className="w-full max-w-md md:max-w-lg rounded-2xl shadow-2xl object-contain"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
