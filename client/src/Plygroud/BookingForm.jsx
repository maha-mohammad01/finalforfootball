import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const BookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    note: '',
    payment_method: '',
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchUserData = () => {
    let token = Cookies.get('authToken');

    if (!token) {
      // If token is not found in cookies, check localStorage
      token = localStorage.getItem('isLoggedIn');
    }

    if (!token) {
      console.error('Token not found. User not authenticated.');
      // Handle authentication failure (redirect to login, show error, etc.)
      return null;
    }

    return token;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = fetchUserData();

    if (!token) {
      return; // Exit the function if there's no token
    }
    console.log("formData",formData)

    try {
      const response = await axios.post(`http://localhost:2000/book-stadium/${id}`,
        {
  "start_time": formData.start_time,
  "end_time": formData.end_time,
  "booking_date": formData.booking_date,
  "phone":"0000000000000",
  "note":formData.note
}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (response.status === 200 || response.status === 201) {
        toast.success('Booking successful!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/Payment');
      } else {
        console.error('Booking failed with status:', response.status);
        toast.error(`Booking failed with status: ${response.status}`, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error during booking:', error);
      toast.error(`Error during booking: ${error.message}`, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });
  }, []);
  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white mt-14">
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <h1 className='font-bold mt-5 text-2xl '>Welcome to Booking Form</h1>
          <div className="mb-5 mt-7">
            <label
              htmlFor="fullName"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              id="fullName"
              placeholder="Full Name"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
              onChange={(e) => { handleChange(e) }}
            />
          </div>

          <div className="mb-5">

            <label
              htmlFor="phone"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Enter your phone number"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
              onChange={(e) => { handleChange(e) }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="date"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Date
            </label>
            <input
              type="date"
              name="booking_date"
              id="date"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
              onChange={(e) => { handleChange(e) }}
            />
          </div>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="startTime"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  id="startTime"
                  className="w-full rounded-md border border-emerald-500 bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
                  onChange={(e) => { handleChange(e) }}
                />
              </div>
            </div>
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="endTime"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  End Time
                </label>
                <input
                  type="time"
                  name="end_time"
                  id="endTime"
                  className="w-full rounded-md border border-emerald-500 bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
                  onChange={(e) => { handleChange(e) }}
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="notice"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Notice
            </label>
            <textarea
              name="note"
              id="notice"
              placeholder="Any additional notes or requests?"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
              onChange={(e) => { handleChange(e) }}
            ></textarea>
          </div>
          <button
            type="submit"
            className="hover:shadow-form w-full rounded-md bg-emerald-500 py-3 px-8 text-center text-base font-semibold text-white outline-none"
          >
            Next Step
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookingForm;
