import React from 'react';
// Removed unused imports for navigation icons
// import { ChevronRightIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react';
// import { Footer } from '../components/Footer';
// import { Header } from '../components/Header';

export const HealthProfessional = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen w-full">
      {/* <Header /> {/* Commented out as per your request */} 

      <main className="flex-1">
        {/* Profile Section */}
        <section className="container mx-auto px-6 pt-16 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="w-[334px] h-[249px] rounded-[80px] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=350"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Details */}
            <div className="flex flex-col gap-6">
              <div className="font-montserrat font-normal text-black text-[40px]">
                Speciality: Midwife
              </div>
              <div className="font-montserrat font-normal text-black text-[40px]">
                License No: MOH123456
              </div>
              <div className="font-montserrat font-medium text-green text-[40px]">
                Verified
              </div>
            </div>
          </div>

          {/* Name */}
          <h1 className="font-montserrat font-medium text-black text-[40px] mt-6">
            Nasaba Bora
          </h1>
        </section>

        {/* Published Articles Section */}
        <section className="w-full bg-cards-color rounded-[20px] p-12">
          <div className="flex flex-col items-center">
            <h2 className="font-montserrat font-medium text-[#665e5e] text-5xl mb-12">
              Published Articles
            </h2>

            <div className="flex flex-row gap-12 justify-center">
              {[1, 2].map((id) => (
                <div
                  key={id}
                  className="w-[298px] h-[270px] bg-white rounded-[60px] flex items-center justify-center"
                >
                  <span className="font-montserrat font-normal text-black text-5xl">
                    Article {id}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Removed navigation arrows */}
        </section>

        {/* New Articles Section */}
        <section className="w-full max-w-[930px] mx-auto my-8 bg-cards-color rounded-[20px] p-8">
          <div className="flex flex-col items-center">
            <h2 className="font-inria font-bold text-[#665e5e] text-5xl mb-6">
              New Articles
            </h2>

            <div className="w-full max-w-[681px] bg-white rounded-[60px] p-8">
              <div className="flex flex-col items-center pt-6">
                <p className="font-montserrat font-light text-black text-5xl mb-8">
                  Write new article
                </p>
                <div className="flex justify-end w-full">
                  <button className="bg-blue-button hover:bg-blue-button/90 rounded-[30px] h-[59px] px-10">
                    <span className="font-inria font-bold text-white text-4xl">
                      Post
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Removed right arrow */}
        </section>
      </main>

      {/* <Footer /> {/* Commented out as per your request */}
    </div>
  );
};
