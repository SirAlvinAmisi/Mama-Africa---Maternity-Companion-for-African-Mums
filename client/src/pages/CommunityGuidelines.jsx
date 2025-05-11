// src/pages/CommunityGuidelines.jsx

export default function CommunityGuidelines() {
    return (
      <div className="bg-cyan-500 flex flex-col w-full">
        <main className="flex-1">
          {/* Community Guidelines Section */}
          <section className="container mx-auto px-6 pt-16 pb-8">
            <h1 className="font-montserrat font-bold text-cyan-900 text-3xl text-center mb-12">
              Community Guidelines
            </h1>
  
            <div className="flex flex-col gap-8 w-full max-w-[930px] mx-auto text-black">
              {/* Guidelines */}
              {[
                {
                  title: 'Respect and Kindness',
                  text: 'Treat everyone with respect. Discrimination, bullying, or harassment will not be tolerated.'
                },
                {
                  title: 'Share Helpful and Accurate Information',
                  text: 'When offering advice or sharing experiences, make sure your information is helpful, respectful, and accurate.'
                },
                {
                  title: 'Protect Privacy',
                  text: 'Do not share private or sensitive information about yourself or others without consent.'
                },
                {
                  title: 'Stay On Topic',
                  text: 'Keep discussions relevant to motherhood, health, wellness, and community building.'
                },
                {
                  title: 'No Spam or Promotions',
                  text: 'Avoid posting unsolicited advertisements or promotions unrelated to the community’s purpose.'
                }
              ].map((rule, idx) => (
                <div key={idx} className="bg-cards-color rounded-[20px] p-8">
                  <h2 className="font-montserrat font-bold text-black text-1xl mb-4">
                    {rule.title}
                  </h2>
                  <p className="font-montserrat font-light text-black text-sm">{rule.text}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }
  