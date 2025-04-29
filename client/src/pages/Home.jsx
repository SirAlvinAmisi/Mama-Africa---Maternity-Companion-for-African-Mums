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
    axios.get('http://localhost:5000/profile')  // Adjust your backend URL if needed
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
      <section className="flex flex-col items-center justify-center py-16 px-4 sm:px-8 bg-cyan-100">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 text-center">Welcome to Mama Afrika</h1>
        <p className="text-gray-600 max-w-2xl text-center text-base sm:text-lg">
          Empowering African mothers and healthcare workers with trusted support, knowledge, and community.
        </p>
      </section>

      {/* Meet Mama Afrika Section */}
      {featuredMums.length > 0 && (
        <section className="py-16 px-6 bg-cyan-50">
          <h2 className="text-3xl font-bold text-cyan-700 text-center mb-8">Meet Our Mamas</h2>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            pagination={{ clickable: true }}
          >
            {featuredMums.map((mum, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto w-full">
                  {/* Mum's Photo */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 bg-cyan-200 rounded-full overflow-hidden shadow-lg mb-4">
                    <img
                      src="https://source.unsplash.com/featured/?african,motherhood"
                      alt={`Featured Mum ${index}`}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Mum's Details */}
                  <h3 className="text-xl sm:text-2xl font-semibold text-cyan-700 mb-2">{mum.full_name}</h3>
                  <p className="text-gray-600 mb-1"><strong>Region:</strong> {mum.region}</p>
                  <p className="text-gray-600 text-center"><strong>Story:</strong> {mum.bio}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </div>
   
  );
}
