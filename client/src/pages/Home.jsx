// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Home() {
  const [featuredMums, setFeaturedMums] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/profile')
      .then(response => {
        const mums = response.data.users.filter(user =>
          user.bio && (
            user.bio.toLowerCase().includes("mum") ||
            user.bio.toLowerCase().includes("pregnancy") ||
            user.bio.toLowerCase().includes("expecting") ||
            user.bio.toLowerCase().includes("mother")
          )
        );
        if (mums.length > 0) {
          const randomMums = [];
          while (randomMums.length < 3 && mums.length > 0) {
            const randomIndex = Math.floor(Math.random() * mums.length);
            randomMums.push(mums.splice(randomIndex, 1)[0]);
          }
          setFeaturedMums(randomMums);
        }
      })
      .catch(error => {
        console.error("Error fetching profiles:", error);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white">
      {/* Intro Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4 sm:px-8 md:px-12 lg:px-20 bg-cyan-100">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 text-center">
          Welcome to Mama Afrika
        </h1>
        <p className="text-gray-600 max-w-2xl text-center text-base sm:text-lg lg:text-xl">
          Empowering African mothers and healthcare workers with trusted support, knowledge, and community.
        </p>
      </section>

      {/* Meet Mama Afrika Section */}
      {featuredMums.length > 0 && (
        <section className="py-12 px-4 sm:px-8 md:px-16 lg:px-32 bg-cyan-50">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-700 text-center mb-8">
              Meet Our Members and Their Stories
            </h2>

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              pagination={{ clickable: true }}
            >
              {featuredMums.map((mum, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
                    {/* Mum's Photo */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 bg-cyan-200 rounded-full overflow-hidden shadow-lg mb-4">
                      <img
                        src="https://source.unsplash.com/featured/?african,motherhood"
                        // alt={Featured Mum ${index}}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Mum's Details */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-cyan-700 mb-2">
                      {mum.full_name}
                    </h3>
                    <p className="text-gray-600 mb-1"><strong>Region:</strong> {mum.region}</p>
                    <p className="text-gray-600 text-center">
                      <strong>Story:</strong> {mum.bio}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
    </div>
  );
}