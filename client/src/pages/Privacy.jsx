import React from 'react';

export const Privacy = () => {
  return (
    <div className="bg-white flex flex-col w-full">
      <main className="flex-1">
        {/* Data Privacy Policy Section */}
        <section className="container mx-auto px-6 pt-16 pb-8">
          <h1 className="font-montserrat font-medium text-[#665e5e] text-5xl text-center mb-12">
            Data Privacy Policy
          </h1>

          <div className="flex flex-col gap-8 w-full max-w-[930px] mx-auto">
            {/* Privacy Section 1: Introduction */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-medium text-black text-3xl mb-4">
                Introduction
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                At Mama Africa, we value your privacy and are committed to protecting your personal information. This Data Privacy Policy outlines how we collect, use, store, and protect your data when you use our services, including our website and mobile applications.
              </p>
            </div>

            {/* Privacy Section 2: Data Collection */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-medium text-black text-3xl mb-4">
                Data Collection
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                We collect personal data such as your name, email address, phone number, and health-related information when you register as a user, interact with healthcare professionals, or contribute to our communities. We also collect non-personal data, such as browsing history and IP addresses, to improve user experience and analyze platform usage.
              </p>
            </div>

            {/* Privacy Section 3: Data Usage and Sharing */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-medium text-black text-3xl mb-4">
                Data Usage and Sharing
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                Your data is used to provide personalized healthcare services, facilitate communication with professionals, and enhance our platform’s functionality. We may share your information with trusted third parties, such as licensed healthcare providers or legal authorities, only when necessary to deliver our services or comply with legal obligations. We do not sell your personal data to third parties.
              </p>
            </div>

            {/* Privacy Section 4: Data Security and Cookies */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-medium text-black text-3xl mb-4">
                Data Security and Cookies
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                We implement robust security measures, including encryption and access controls, to protect your data from unauthorized access or breaches. Our platform uses cookies to enhance your browsing experience, such as remembering your preferences and analyzing site traffic. You can manage cookie settings in your browser to opt out if desired.
              </p>
            </div>

            {/* Privacy Section 5: User Rights and Contact Information */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-medium text-black text-3xl mb-4">
                User Rights and Contact Information
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                You have the right to access, update, or delete your personal data at any time through your account settings. If you have questions or concerns about your privacy or this policy, please contact us at info@mamaafrica.com. We are here to assist you and ensure your data is handled responsibly.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};