// src/pages/HelpCenter.jsx

export default function HelpCenter() {
    return (
      <div className="bg-white flex flex-col w-full">
        <main className="flex-1">
          {/* Help Center Section */}
          <section className="container mx-auto px-6 pt-16 pb-8">
            <h1 className="font-montserrat font-medium text-[#665e5e] text-5xl text-center mb-12">
              Help Center
            </h1>
  
            <div className="flex flex-col gap-8 w-full max-w-[930px] mx-auto">
              {/* Help Center Topics */}
              {[
                {
                  title: 'How can I reset my password?',
                  text: 'Go to the login page, click on “Forgot Password”, and follow the instructions sent to your email.'
                },
                {
                  title: 'How do I contact a health professional?',
                  text: 'Visit the “Health Professionals” section, view available experts, and send them a secure message.'
                },
                {
                  title: 'How can I report inappropriate behavior?',
                  text: 'Use the “Report” button next to posts or profiles. Our team will review the report promptly.'
                },
                {
                  title: 'Can I edit or delete my posts?',
                  text: 'Yes, go to your profile, find your post, and click “Edit” or “Delete”.'
                },
                {
                  title: 'Who can I contact for further assistance?',
                  text: 'Email us at support@mamaafrika.com — our support team is happy to help you!'
                }
              ].map((topic, idx) => (
                <div key={idx} className="bg-cards-color rounded-[20px] p-8">
                  <h2 className="font-montserrat font-medium text-black text-3xl mb-4">
                    {topic.title}
                  </h2>
                  <p className="font-montserrat font-light text-black text-xl">{topic.text}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }
  