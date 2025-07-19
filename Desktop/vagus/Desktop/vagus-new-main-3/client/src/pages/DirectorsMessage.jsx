import React from 'react';

const DirectorsMessage = () => {
  return (
    <section id="directors-message" className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center mb-10 text-indigo-800">
          Director's Message
        </h2>

        {/* Director Video */}
        <div className="flex justify-center mb-10">
          <div className="w-full md:w-2/3 aspect-video shadow-lg rounded overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Director's Message"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">Our Mission</h3>
            <p className="text-gray-700">
              To provide the highest quality coaching and personalized mentoring for NEET aspirants
              through expert faculty, intensive practice, and academic discipline.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">Our Vision</h3>
            <p className="text-gray-700">
              To be the leading NEET coaching institute in the country, known for producing top-ranked students
              and empowering rural and urban youth alike.
            </p>
          </div>
        </div>

        {/* Faculty Section */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-6 text-indigo-800">Our Faculty</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Dr. BV PS', subject: 'Biology', photo: '/faculty/kumar.jpg' },
              { name: 'Dr. Devipriya', subject: 'Chemistry', photo: '/faculty/meena.jpg' },
              { name: 'Mr. Sagar GH', subject: 'Mathematics', photo: '/faculty/rao.jpg' },
              { name: 'Dr. Veena GH', subject: 'Physics', photo: '/faculty/singh.jpg' }
            ].map((fac, idx) => (
              <div key={idx} className="bg-gray-100 text-center p-4 rounded shadow">
                <img
                  src={fac.photo}
                  alt={fac.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover border mb-3"
                />
                <h4 className="text-lg font-semibold text-indigo-700">{fac.name}</h4>
                <p className="text-sm text-gray-600">{fac.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorsMessage;
