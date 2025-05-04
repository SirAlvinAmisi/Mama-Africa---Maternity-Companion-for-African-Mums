import React from 'react';

export const Terms = () => {
  return (
    <div className="bg-cyan-500 flex flex-col w-full">
      <main className="flex-1">
        {/* Terms and Conditions Section */}
        <section className="container mx-auto px-6 pt-16 pb-8">
          <h1 className="font-montserrat font-bold text-black text-4xl text-center mb-12">
            Our Terms and Conditions
          </h1>

          <div className="flex flex-col gap-8 w-full max-w-[930px] mx-auto text-black">
            {/* Term 1: Acceptance of Terms */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                By accessing or using the Mama Africa platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
              </p>
            </div>

            {/* Term 2: User Responsibilities */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                2. User Responsibilities
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and up-to-date information when using our services.
              </p>
            </div>

            {/* Term 3: Prohibited Activities */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                3. Prohibited Activities
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                You may not use our platform for any unlawful or unauthorized purpose, including but not limited to sharing false medical information, harassing other users, or attempting to access unauthorized data.
              </p>
            </div>

            {/* Term 4: Intellectual Property */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                4. Intellectual Property
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                All content on the Mama Africa platform, including text, images, and logos, is the property of Mama Africa or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce or distribute our content without permission.
              </p>
            </div>

            {/* Term 5: Limitation of Liability */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                5. Limitation of Liability
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                Mama Africa is not liable for any damages resulting from the use of our services, including but not limited to indirect, incidental, or consequential damages. Our platform is provided on an "as-is" basis.
              </p>
            </div>

            {/* Term 6: Termination */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                6. Termination
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                We reserve the right to terminate or suspend your account at our discretion, including for violations of these terms, without prior notice. Upon termination, your access to our services will cease immediately.
              </p>
            </div>

            {/* Term 7: Governing Law */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                7. Governing Law
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                These Terms and Conditions are governed by the laws of the jurisdiction in which Mama Africa operates. Any disputes arising from these terms will be resolved in the courts of that jurisdiction.
              </p>
            </div>

            {/* Term 8: Changes to Terms */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                8. Changes to Terms
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                We may update these Terms and Conditions from time to time. Any changes will be posted on this page, and your continued use of our services after such changes constitutes your acceptance of the updated terms.
              </p>
            </div>

            {/* Term 9: Contact Information */}
            <div className="bg-cards-color rounded-[20px] p-8">
              <h2 className="font-montserrat font-bold text-black text-3xl mb-4">
                9. Contact Information
              </h2>
              <p className="font-montserrat font-light text-black text-xl">
                If you have any questions about these Terms and Conditions, please contact us at info@mamaafrica.com. We are here to assist you.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};