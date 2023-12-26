import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function FAQs() {
  const [faqsData, setFaqsData] = useState([]);
  const [answersVisible, setAnswersVisible] = useState(Array(faqsData.length).fill(false));

  const toggleAnswer = (index) => {
    setAnswersVisible((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = !newAnswers[index];
      return newAnswers;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3010/FAQs');
        setFaqsData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section className="py-10 bg-gray-50 sm:py-16 lg:py-24 mt-10">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              <b className='text-emerald-500'>E</b>xplore Com<b className='text-emerald-500'>m</b>on <b className='text-emerald-500'>Questions</b>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
            {faqsData.map((faq, index) => (
              <div
                key={index}
                className="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50"
              >
                <button
                  type="button"
                  onClick={() => toggleAnswer(index)}
                  className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                >
                  <span className="flex text-lg font-semibold text-black">{faq.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`w-6 h-6 text-gray-400 ${answersVisible[index] ? 'rotate-0' : 'rotate-180'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div
                  style={{ display: answersVisible[index] ? 'block' : 'none' }}
                  className="px-4 pb-5 sm:px-6 sm:pb-6"
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-700 textbase mt-9">
            Still have questions?
           <Link to="/contactus"> <span className="cursor-pointer font-medium text-emerald-500 transition-all duration-200 hover:text-emerald-700 focus:text-emerald-500 hover-underline">
              Contact our support
            </span></Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default FAQs;
