import React, { useEffect, useState } from 'react';

const ParentingDevelopmentPage = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const dummyArticles = [
  {
    "id": 1,
    "title": "The Power of Responsive Parenting",
    "content": "Children don\u2019t come with instruction manuals, but your responsiveness is the next best thing. Research shows that consistently warm, attuned reactions to a child\u2019s needs build trust, emotional intelligence, and resilience. Want your child to thrive socially and emotionally? Start with eye contact, giggles, and timely cuddles\u2014they're the Wi-Fi of the parenting world: invisible but powerful.",
    "image": "https://i.pinimg.com/736x/79/31/e2/7931e2dd9f9d4e4f54054f6de5414b1d.jpg"
  },
  {
    "id": 2,
    "title": "Play is Brain Work",
    "content": "Play isn't just for fun\u2014it's brain fuel. According to pediatric neuroscience, unstructured play builds executive function, creativity, and self-regulation. Whether it\u2019s mud pies or building blocks, play teaches problem-solving, risk-taking, and emotional control. So next time your toddler floods the kitchen playing 'scientist', take a deep breath and remind yourself\u2014it\u2019s prefrontal cortex day at the lab.",
    "image": "https://i.pinimg.com/736x/1c/8f/89/1c8f899168970ca3bce5c60661ed835f.jpg"
  },
  {
    "id": 3,
    "title": "Early Attachment Shapes the Future",
    "content": "Secure attachment in the first 24 months is like premium insurance for a child\u2019s future relationships. Babies learn to trust the world when their caregivers are predictable and comforting. Research shows strong early bonds link to better grades, social confidence, and even fewer chronic illnesses later in life. Your hug today echoes for decades\u2014wrap wisely.",
    "image": "https://i.pinimg.com/736x/76/55/9e/76559e09a827fc0e0733c05435f85c3c.jpg"
  },
  {
    "id": 4,
    "title": "Reading Aloud Boosts Brain Development",
    "content": "Reading aloud is a superpower. According to a 2015 AAP study, daily reading from infancy improves language skills, emotional connection, and future literacy. The rhythm of your voice builds neural pathways. Dr. Seuss isn\u2019t just entertaining\u2014he\u2019s wiring up the left temporal lobe. Grab a picture book and build some gray matter, one rhyme at a time.",
    "image": "https://i.pinimg.com/736x/32/9e/7b/329e7b52bc63bd163632d865b73d8dff.jpg"
  },
  {
    "id": 5,
    "title": "Nutrition and Early Brain Growth",
    "content": "The first 1,000 days\u2014from conception to age two\u2014are critical for brain growth. DHA, iron, and zinc are the unsung heroes of memory, mood, and cognition. Local power foods like omena, ndengu, and pumpkin seeds are budget-friendly boosters. Think of every meal as a brain-building brick\u2014feed wisely and often.",
    "image": "https://i.pinimg.com/736x/31/9c/65/319c65ee5aa534bae0de735bf158bab6.jpg"
  },
  {
    "id": 6,
    "title": "Parental Mental Health Affects Children",
    "content": "Your mental health sets the emotional climate at home. Studies show that untreated maternal depression can impact a child\u2019s cognitive development and stress response. Getting help isn\u2019t selfish\u2014it\u2019s parenting on expert mode. Take care of yourself not just because you\u2019re important\u2014but because they think you\u2019re the sun and moon.",
    "image": "https://i.pinimg.com/736x/4f/b6/52/4fb652c4ec3438ef56cdfdaf506da684.jpg"
  },
  {
    "id": 7,
    "title": "Talking to Babies Wires Their Brains",
    "content": "Every coo, giggle, and baby babble matters. Studies show that talking to babies\u2014even when they can\u2019t talk back\u2014enhances vocabulary, auditory skills, and emotional bonding. It\u2019s not about perfect grammar; it\u2019s about love in language. So go ahead and narrate your laundry routine\u2014you\u2019re literally shaping neurons.",
    "image": "https://i.pinimg.com/736x/17/da/61/17da61427d773c9ba40de28b83b4bf98.jpg"
  },
  {
    "id": 8,
    "title": "Sleep and Brain Architecture",
    "content": "Infant sleep isn\u2019t just for your sanity\u2014it\u2019s for their brain architecture. During sleep, babies consolidate memories, develop motor skills, and regulate growth hormones. Consistent bedtime routines help foster emotional regulation. So yes, that 7 p.m. bath-book-bed ritual? It's basically a construction schedule for their cerebellum.",
    "image": "https://i.pinimg.com/736x/39/5b/39/395b39b87e3d8d94134a4f2e1257a484.jpg"
  }
];
    setArticles(dummyArticles);
  }, []);

  return (
    <div className="bg-gradient-to-b from-cyan-100 to-purple-100 py-10 px-4 sm:px-8 md:px-16 lg:px-24 rounded-lg shadow-inner">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-cyan-800 mb-6">
          💡 Parenting Development
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
          Evidence-based insights and nurturing tips to help raise emotionally intelligent and resilient children.
        </p>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover object-top rounded-t-2xl"
                />
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-800 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {article.content.slice(0, 120)}...
                    </p>
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">Loading articles...</p>
        )}

        {/* Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-cyan-800 mb-4">
                {selectedArticle.title}
              </h2>
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-60 object-cover rounded-md mb-4"
              />
              <p className="text-gray-800 leading-relaxed">
                {selectedArticle.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentingDevelopmentPage;
