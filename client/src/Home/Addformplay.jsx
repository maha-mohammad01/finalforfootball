


import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AddFormPlay = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    location: '',
    size: '',
    hourly_rate: '',
    description: '',
    phone: '',
    start_time: '',
    end_time: '',
    images_url: [], // Corrected name
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = fetchUserData();
    if (!token) {
      toast.error('User not authenticated. Please log in.', {});
      return;
    }
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof FileList) {
        const imagesArray = Array.from(value);
        imagesArray.forEach((image, index) => {
          formDataToSend.append(`images_url`, image); // Corrected name
        });
      } else {
        formDataToSend.append(key, value);
      }
    });
  
    try {
      const response = await axios.post('http://localhost:2000/add-stadium', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status >= 200 && response.status < 300) {
        toast.success('Stadium added successfully!', {});
        navigate('/price');
      } else {
        console.error('Stadium addition failed with status:', response.status);
        const errorMessage = response.data.message || 'Stadium addition failed. Please try again.';
        toast.error(errorMessage, {});
      }
    } catch (error) {
      console.error('Error during stadium addition:', error);
      if (error.response) {
        console.error('Axios Error Details:', error.response);
        const errorMessage = error.response.data.message || 'Error during stadium addition. Please try again.';
        toast.error(errorMessage, {});
      } else {
        toast.error('Error during stadium addition. Please try again.', {});
      }
    }
  };
  
  
  const handleChange = (e) => {
    if (e.target.name === 'images_url') {
      const files = e.target.files;
      setFormData({
        ...formData,
        images_url: files,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const fetchUserData = () => {
    let token = Cookies.get('authToken') || localStorage.getItem('isLoggedIn');

    if (!token) {
      console.error('Token not found. User not authenticated.');
      return null;
    }

    return token;
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white mt-14">
      <form onSubmit={handleSubmit}>
          <h1 className="font-bold mt-5 text-2xl">Welcome to Add Playground Form</h1>

          {/* Full Name */}
          <div className="mb-5 mt-7">
            <label
              htmlFor="fullName"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Name Your stadium
            </label>
            <input
              type="text"
              name="name"
              id="fullName"
              placeholder="Full Name"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
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
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="mb-5">
            <label
              htmlFor="location"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Location"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div className="mb-5">
            <label
              htmlFor="city"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
              onChange={handleChange}
            />
          </div>

          {/* Price and Size */}
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              {/* Price */}
              <div className="mb-5">
                <label
                  htmlFor="price"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="hourly_rate"
                  id="price"
                  className="w-full rounded-md border border-emerald-500 bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full px-3 sm:w-1/2">
              {/* Size */}
              <div className="mb-5">
                <label
                  htmlFor="size"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Size
                </label>
                <input
                  type="size"
                  name="size"
                  id="size"
                  className="w-full rounded-md border border-emerald-500 bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Start Time and End Time */}
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              {/* Start Time */}
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
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-full px-3 sm:w-1/2">
              {/* End Time */}
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
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label
              htmlFor="notice"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Description
            </label>
            <textarea
              name="description"
              id="notice"
              placeholder="Any additional notes or requests?"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-emerald-500 outline-none focus:border-emerald-500 focus:shadow-md"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Upload Images */}
          <div className="mb-5">
  <label
    htmlFor="images_url" // Corrected htmlFor
    className="mb-3 block text-base font-medium text-[#07074D]"
  >
    Upload Images
  </label>
  <input
    type="file"
    name="images_url" // Corrected name
    id="images"
    accept="image/*"
    multiple
    onChange={handleChange}
  />
</div>

          {/* Submit Button */}
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

export default AddFormPlay;


