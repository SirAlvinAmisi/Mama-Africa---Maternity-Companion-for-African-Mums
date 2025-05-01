// src/pages/HealthProfessionalMom.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../lib/api';
import QuestionCard from '../components/posts/QuestionCard';

export const HealthProfessionalMom = () => {
  const [selectedMum, setSelectedMum] = useState(null);
  const [answer, setAnswer] = useState('');
  const queryClient = useQueryClient();

  const mums = [
    { id: 1, full_name: 'Damaris Ngari' },
    { id: 2, full_name: 'Martha Mwangi' },
  ];

  const { data: questions, isLoading } = useQuery({
    queryKey: ['mumQuestions', selectedMum?.id],
    queryFn: () => api.getQuestionsByUser(selectedMum.id).then(res => res.data),
    enabled: !!selectedMum,
  });

  const answerMutation = useMutation({
    mutationFn: ({ questionId, answer }) => api.answerQuestion(questionId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries(['mumQuestions', selectedMum?.id]);
      setAnswer('');
    },
  });

  const handleAnswerSubmit = (questionId) => {
    if (!answer.trim()) return;
    answerMutation.mutate({ questionId, answer });
  };

  return (
    <div className="bg-white flex flex-col min-h-screen w-full">
      <main className="flex-1">
        <section className="container mx-auto px-6 pt-16 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-[334px] h-[249px] rounded-[80px] overflow-hidden">
              <img
                src="/mom-profile.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
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
          <h1 className="font-montserrat font-medium text-black text-[40px] mt-6">
            Nasaba Bora
          </h1>
        </section>

        <section className="w-full bg-cards-color rounded-[20px] p-12">
          <div className="flex flex-col items-center">
            <h2 className="font-montserrat font-medium text-[#665e5e] text-5xl mb-12">
              List of Moms in Your Care
            </h2>
            <div className="flex flex-col gap-8 w-full max-w-[681px]">
              {mums.map((mum) => (
                <div key={mum.id} className="bg-white rounded-[60px] p-8">
                  <h3
                    className="font-montserrat font-normal text-black text-5xl mb-4 cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedMum(mum)}
                  >
                    {mum.full_name}
                  </h3>
                  <p className="font-montserrat font-light text-black text-xl mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
                  </p>
                  <div className="flex justify-end">
                    <button className="bg-green hover:bg-green/90 rounded-[30px] h-[59px] px-10">
                      <span className="font-inria font-bold text-white text-4xl">
                        Attachments
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {selectedMum && (
          <section className="w-full max-w-[930px] mx-auto my-8 bg-cards-color rounded-[20px] p-8">
            <div className="flex flex-col items-center">
              <h2 className="font-inria font-bold text-[#665e5e] text-5xl mb-6">
                Questions by {selectedMum.full_name}
              </h2>
              {isLoading ? (
                <p>Loading questions...</p>
              ) : questions?.length > 0 ? (
                <div className="w-full space-y-4">
                  {questions.map((question) => (
                    <div key={question.id} className="bg-white rounded-[60px] p-8">
                      <QuestionCard question={question} />
                      {!question.answer_text && (
                        <div className="mt-4">
                          <textarea
                            className="w-full p-3 border rounded"
                            placeholder="Write your answer..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                          />
                          <button
                            className="bg-blue-button hover:bg-blue-button/90 rounded-[30px] h-[59px] px-10 mt-2"
                            onClick={() => handleAnswerSubmit(question.id)}
                          >
                            <span className="font-inria font-bold text-white text-4xl">
                              Submit Answer
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No questions found.</p>
              )}
              <button
                className="mt-6 bg-gray-500 text-white rounded-[30px] h-[59px] px-10"
                onClick={() => setSelectedMum(null)}
              >
                Close
              </button>
            </div>
          </section>
        )}

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
        </section>
      </main>
    </div>
  );
};
