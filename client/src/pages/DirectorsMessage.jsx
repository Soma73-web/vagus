import React from 'react';
import { FaUserTie } from 'react-icons/fa';

const faculty = [
  { name: 'Dr. BV PS', subject: 'Biology', photo: '/faculty/kumar.jpg' },
  { name: 'Dr. Devipriya', subject: 'Chemistry', photo: '/faculty/meena.jpg' },
  { name: 'Mr. Sagar GH', subject: 'Mathematics', photo: '/faculty/rao.jpg' },
  { name: 'Dr. Veena GH', subject: 'Physics', photo: '/faculty/singh.jpg' }
];

const DirectorsMessage = () => {
  return (
    <section id="directors-message" className="bg-white pt-[120px] min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-12 mb-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
          <img
            src="/faculty/director.jpg"
            alt="Director"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg mb-4 md:mb-0"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-2 drop-shadow-sm">
              Director's Message
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              Welcome to Vagus Science Academy! Our mission is to empower every student to achieve their dreams through quality education, mentorship, and innovation.
            </p>
            <span className="inline-flex items-center gap-2 text-indigo-700 font-semibold">
              <FaUserTie /> Dr. BV PS, Director
            </span>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="rounded-lg overflow-hidden aspect-video shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/uQzFihB5-B4"
            title="Director's Message"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-indigo-700">Our Mission</h3>
          <p className="text-gray-700">
            To provide the highest quality coaching and personalized mentoring for NEET aspirants through expert faculty, intensive practice, and academic discipline.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-indigo-700">Our Vision</h3>
          <p className="text-gray-700">
            To be the leading NEET coaching institute in the country, known for producing top-ranked students and empowering rural and urban youth alike.
          </p>
        </div>
      </div>

      {/* Faculty Section */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <h3 className="text-2xl font-bold text-center mb-8 text-indigo-800">Our Faculty</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {faculty.map((fac, idx) => (
            <div key={idx} className="bg-gray-50 text-center p-6 rounded-lg shadow hover:shadow-md transition flex flex-col items-center">
              <img
                src={fac.photo}
                alt={fac.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-indigo-200 mb-3"
                onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fac.name); }}
              />
              <h4 className="text-lg font-semibold text-indigo-700 mb-1">{fac.name}</h4>
              <p className="text-sm text-gray-600">{fac.subject}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DirectorsMessage;
