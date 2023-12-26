import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    // Validation: Check if the email is not empty
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      // Send a request to the server to handle password reset
      const response = await axios.post('http://localhost:3010/reset-password', { email });

      if (response.status === 200 || response.status === 201) {
        // Successful password reset request
        setSuccessMessage('Password reset email sent. Check your inbox.');
      }
    } catch (error) {
      // Unsuccessful password reset request
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen mt-16">
      <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border z-[3] mb-11">
        <div className="relative grid mx-4 mb-4 -mt-6 overflow-hidden text-white shadow-lg h-28 place-items-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 bg-clip-border shadow-emerald-600/40">
          <h3 className="block font-sans text-3xl antialiased font-semibold leading-snug tracking-normal text-white">
            Forgot Password
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="relative h-11 w-full min-w-[200px] mt-10">
            <input
              className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-emerald-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-emerald-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-emerald-600 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-emerald-600 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Email
            </label>
          </div>
          <button
            className="block w-full select-none rounded-lg mt-10 bg-gradient-to-tr from-emerald-600 to-emerald-400 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-600/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-ripple-light="true"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {successMessage && <p className="text-emerald-600 mt-2">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
