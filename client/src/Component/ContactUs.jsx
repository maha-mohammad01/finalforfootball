import React, { useState,useEffect } from 'react';
import axios from 'axios';

function ContactUs() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Form validation logic (add your own validation here)

      // Show loading state
      setLoading(true);

      // Replace 'YOUR_BACKEND_ENDPOINT' with your actual backend endpoint
      const response = await axios.post('http://localhost:2000/contact', formData);

      // Reset the form on successful submission
      setFormData({
        full_name: '',
        email: '',
        message: '',
      });

      // Provide feedback to the user
      if (response.status === 200) {
        setSubmitSuccess(true);
      } else {
        setSubmitError('Failed to send email');
      }
    } catch (error) {
      // Provide specific error messages to the user
      setSubmitError(`Error sending email: ${error.message}`);
    } finally {
      // Hide loading state
      setLoading(false);
    }
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="font-[sans-serif] w-full max-w-7xl mx-auto relative bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] overflow-hidden mt-32 mb-24">
      <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-emerald-400" />
      <div className="absolute -bottom-6 -left-0 w-24 h-20 rounded-tr-[40px] bg-teal-200" />
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-emerald-400" />
      <div className="absolute -bottom-6 -right-0 w-24 h-20 rounded-tl-[40px] bg-emerald-300" />
      <div className="grid md:grid-cols-2">
        <div className="text-center p-6 xl:p-10 flex flex-col items-center justify-center">
          <h2 className="text-3xl text-emerald-500 font-bold">Contact Us</h2>
          <img
            src="https://images.pexels.com/photos/8600867/pexels-photo-8600867.jpeg?auto=compress&cs=tinysrgb&w=600"
            className="mt-4 shrink-0 w-full"
            alt="Contact Us"
          />
        </div>
        <form onSubmit={handleSubmit} className="p-6 xl:p-10 mt-16">
          <div className="max-w-sm mx-auto space-y-4">
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full bg-gray-100 rounded-full py-3 px-6 text-sm outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-gray-100 rounded-full py-3 px-6 text-sm outline-none"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows={6}
              className="w-full bg-gray-100 rounded-3xl px-6 text-sm pt-3 outline-none"
            />
            <button
              type="submit"
              className="text-white w-full relative bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-full text-sm px-6 py-3"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                fill="#fff"
                className="mr-2 inline"
                viewBox="0 0 548.244 548.244"
              >
                <path
                  fillRule="evenodd"
                  d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
                  clipRule="evenodd"
                  data-original="#000000"
                />
              </svg>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
      {/* Display success or error message */}
      {submitSuccess && <p className="text-green-500">Email sent successfully!</p>}
      {submitError && <p className="text-red-500">{submitError}</p>}
    </div>
  );
}

export default ContactUs;
