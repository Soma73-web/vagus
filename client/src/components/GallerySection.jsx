// components/GallerySection.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import heroBg from '../assets/gallery-hero.jpg';

const GallerySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/image-gallery/categorized`);
        setCategories(res.data);
      } catch (err) {
        console.error('Gallery fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <>
      {/* Hero Banner */}
      <div
        className="h-[350px] md:h-[420px] w-full bg-center bg-cover flex items-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="bg-black/40 w-full h-full absolute top-0 left-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Explore Our Gallery
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Our campus is more than just an appealing place to live—it’s a welcoming
            community where you’ll make lifelong friends and life-changing decisions.
          </p>
        </div>
      </div>

      {/* Categorized Gallery */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center animate-pulse">Loading images …</p>
          ) : categories.length === 0 ? (
            <p className="text-center italic text-gray-500">
              No categorized images available.
            </p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="mb-12">
                <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {category.CategorizedGalleryImages && category.CategorizedGalleryImages.length > 0 ? (
                    category.CategorizedGalleryImages.map((img) => (
                      <div
                        key={img.id}
                        className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                      >
                        <img
                          src={img.image_url}
                          alt={category.name}
                          loading="lazy"
                          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic col-span-full">No images in this category.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default GallerySection;
