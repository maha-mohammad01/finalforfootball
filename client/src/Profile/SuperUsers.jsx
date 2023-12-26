import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const getAuthToken = () => {
  let token = localStorage.getItem('authToken');
  if (!token) {
    token = Cookies.get('authToken');
  }
  return token;
};

const SuperProfile = () => {
  const [userId, setUserId] = useState(1);
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [formbookingData, setFormBookingData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [userData, setUserData] = useState({ pic_user: '' });
  const [newUserData, setNewUserData] = useState({ full_name: '', email: '', image: null });
  const [userImage, setUserImage] = useState('');
  const [activeTab, setActiveTab] = useState('EditProfile');
  const [userBookings, setUserBookings] = useState([]);
  const [cancelable, setCancelable] = useState(true);
  const [cancellationExpired, setCancellationExpired] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'formbooking') {
      fetchUserBookings();
    }
  };

  const fetchUserBookings = async () => {
    try {
      const token = getAuthToken();
  
      if (!token) {
        console.error('Token not found. User not authenticated.');
        return;
      }
  
      const response = await axios.get('http://localhost:2000/user-bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data);
  
      const bookings = response.data.bookings || [];
  
      if (bookings.length > 0) {
        const currentDateTime = new Date();
        const bookingDateTime = new Date(bookings[0].booking_date);
        const cancellationTimeLimit = new Date(bookingDateTime.getTime() + 60 * 60 * 1000);
  
        setCancelable(currentDateTime < cancellationTimeLimit);
        setCancellationExpired(currentDateTime >= cancellationTimeLimit);
      } else {
        // Handle the case when there are no bookings
        console.warn('No bookings found.');
      }
  
      setUserBookings(bookings);
    } catch (error) {
      console.error('Error fetching user bookings: ', error);
    }
  };

  const fetchUserData = () => {
    const token = getAuthToken();

    if (!token) {
      console.error('Token not found. User not authenticated.');
      return;
    }

    axios.get('http://localhost:2000/user-profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setUserData(response.data.user);
        setFullName(response.data.user.full_name);
        setEmail(response.data.user.email);
        setNewUserData({
          full_name: response.data.user.full_name,
          email: response.data.user.email,
          pic_user: null,
        });
        setUserImage(response.data.user.pic_user);
      })
      .catch(error => {
        console.error('Error fetching user data: ', error);
      });
  };

  const handleSaveDataChanges = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        console.error('Token not found. User not authenticated.');
        return;
      }

      const data = {
        full_name: newUserData.full_name,
        email: newUserData.email,
      };

      const response = await axios.put(`http://localhost:2000/update-user`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setUserData(response.data.user);
      setFullName(response.data.user.full_name);
      setEmail(response.data.user.email);
      setNewUserData({
        full_name: response.data.user.full_name,
        email: response.data.user.email,
        pic_user: null,
      });

      alert('Changes saved successfully');
      console.log('Response data:', response.data);
    } catch (error) {
      console.error('Error saving changes: ', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setNewUserData({
        ...newUserData,
        image: selectedImage,
      });
      setUserImage(URL.createObjectURL(selectedImage));
    }
  };

  const handleSaveImageChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('image', newUserData.image);

      const token = getAuthToken();
      if (!token) {
        console.error('Token not found. User not authenticated.');
        return;
      }

      const response = await axios.post('http://localhost:2000/upload-upic', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUserImage(response.data.imageUrl);
      alert('Image changes saved successfully');
    } catch (error) {
      console.error('Error saving image changes: ', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = getAuthToken();

      if (!token) {
        console.error('Token not found. User not authenticated.');
        return;
      }

      // إرسال طلب لإلغاء الحجز باستخدام bookingId

      // تحديث الحالة بعد إلغاء الحجز بنجاح
      setCancelable(false);
      setCancellationExpired(true);

      alert('Booking canceled successfully');
    } catch (error) {
      console.error('Error canceling booking: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    fetchUserBookings();
  }, []); 

  useEffect(() => {
    axios.get('http://example.com/api/wishlist')
      .then(response => {
        setWishlistData(response.data);
      })
      .catch(error => {
        console.error('Error fetching wishlist data: ', error);
      });
  }, []);
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });
  }, []);
  const [playgroundData, setPlaygroundData] = useState({
    name: '',
    price: '',
    start_time: '',
    end_time: '',
    images: [], // Updated for multiple images
    description: '',
    // Add other playground details as needed
  });
  const handleSavePlaygroundChanges = async () => {
    try {
      let token = Cookies.get('authToken') || localStorage.getItem('authToken');

      if (!token) {
        console.error('Token not found. User not authenticated.');
        // Handle authentication failure (e.g., redirect to login, show error message, etc.)
        return;
      }

      const formData = new FormData();
      formData.append('name', playgroundData.name);
      formData.append('price', playgroundData.price);
      formData.append('start_time', playgroundData.start_time);
      formData.append('end_time', playgroundData.end_time);
      formData.append('description', playgroundData.description);

      // Append each image to the form data
      for (let i = 0; i < playgroundData.images.length; i++) {
        formData.append(`images[${i}]`, playgroundData.images[i]);
      }

      const response = await axios.put(`http://localhost:2000/update-playground`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Display a success message and log the response data
      alert('Playground changes saved successfully');
      console.log('Response data:', response.data);

      // Redirect or update UI as needed
    } catch (error) {
      console.error('Error saving playground changes: ', error);

      // Handle error (display error message, etc.)
    }
  };

  const handlePlaygroundImagesChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedImages = Array.from(e.target.files);
      setPlaygroundData({
        ...playgroundData,
        images: selectedImages,
      });
    }
  };
  
  return (
      <div>
        <div className="sm mt-24 bg-emerald-500 h-52 w-full flex items-center justify-center relative ">
          {/* Display the user's profile image outside the container */}
          <img
            src={userImage}
            className="h-32 w-32 rounded-full border-4 border-white absolute"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
        <div className="sm mt-20">
          <div className="text-center p-4">
            {/* Content container without background */}
            <div>
              <span className="font-medium  text-gray-900">{full_name}</span><br />
              <span className="text-gray-500">{email}</span><br />
            </div>
          </div>
        </div>


      <ul className="text-sm font-medium text-center text-emerald-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-emerald-700 dark:text-emerald-400">
        <li className="w-full">
          <a
            href="#"
            onClick={() => setActiveTab('EditProfile')}
            className={`inline-block w-full p-4 ${
              activeTab === 'EditProfile'
                ? 'text-emerald-900 bg-gray-100'
                : 'bg-white hover:text-emerald-700 hover:bg-gray-50'
            } rounded-l-lg focus:ring-4 focus:ring-emerald-300 active focus:outline-none dark:bg-emerald-700 dark:text-white`}
            aria-current={activeTab === 'EditProfile' ? 'page' : null}
          >
            Edit Profile
          </a>
        </li>

        <li className="w-full">
          <a
            href="#"
            onClick={() => setActiveTab('formbooking')}
            className={`inline-block w-full p-4 ${
              activeTab === 'formbooking'
                ? 'bg-white hover:text-emerald-700 hover:bg-gray-50'
                : 'dark-bg-gray-800 dark-hover-text-white dark-hover-bg-gray-700'
            } focus-ring-4 focus-ring-blue-300 focus-outline-none`}
            aria-current={activeTab === 'formbooking' ? 'page' : null}
          >
            Your Booking
          </a>
        </li>
        <li className="w-full">
          <a
            href="#"
            onClick={() => setActiveTab('EditMyPlayground')}
            className={`inline-block w-full p-4 ${
              activeTab === 'EditMyPlayground'
                ? 'text-emerald-900 bg-gray-100'
                : 'bg-white hover:text-emerald-700 hover:bg-gray-50'
            } focus-ring-4 focus-ring-emerald-300 active focus:outline-none dark:bg-emerald-700 dark:text-white`}
            aria-current={activeTab === 'EditMyPlayground' ? 'page' : null}
          >
            Edit My Playground
          </a>
        </li>
        <li className="w-full">
          <a
            href="#"
            onClick={() => setActiveTab('WishList')}
            className={`inline-block w-full p-4 ${
              activeTab === 'WishList'
                ? 'bg-white hover:text-emerald-700 hover:bg-gray-50'
                : 'dark-bg-gray-800 dark-hover-text-white dark-hover-bg-gray-700'
            } rounded-r-lg focus-ring-4 focus-outline-none focus-ring-blue-300`}
            aria-current={activeTab === 'WishList' ? 'page' : null}
          >
            Wish List
          </a>
        </li>
      </ul>

      {activeTab === 'EditProfile' && (
        <div className="flex justify-center mt-20 px-8">
          <form className="max-w-2xl" encType="multipart/form-data" action="/update-profile" method="post">
            <div className="border shadow rounded-lg p-6 bg-white dark:bg-emerald-600">
              <h2 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-300 mb-4">Account Settings</h2>

              <div className="mb-4">
                <label className="text-emerald-600 dark:text-emerald-400 block">Full Name</label>
                <input
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
                  type="text"
                  value={newUserData.full_name}
                  onChange={(e) => setNewUserData({ ...newUserData, full_name: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="text-emerald-600 dark:text-emerald-400 block">Password</label>
                <input
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
                  type="password"
                />
              </div>



              <div className="mb-4">
                <label className="text-emerald-600 dark:text-gray-400 block ">Email</label>
                <input
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="text-emerald-600 dark:text-gray-400 block">Profile Picture</label>
                <input
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveDataChanges}
                  className="py-2 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring focus:border-emerald-300"
                  type="button"
                >
                  Save Data Changes
                </button>
                <button
                  onClick={handleSaveImageChanges}
                  className="ml-2 py-2 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring focus:border-emerald-300"
                  type="button"
                >
                  Save Image Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'formbooking' && (
        <div>
          <h2>Your Booking:</h2>
          {formbookingData && formbookingData.map((order) => (
            <div key={order.id}>
              <p>{order.orderNumber}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'WishList' && (
        <div>
          <h2>Wishlist:</h2>
          {wishlistData && wishlistData.map((item) => (
            <div key={item.id}>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'EditMyPlayground' && (
    <div className="flex justify-center mt-20 px-8">
      <form className="w-[70%]">
        <div className="border shadow rounded-lg p-6 bg-white dark:bg-emerald-600">
          <h2 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-300 mb-4">Edit Playground</h2>

          <div className="mb-4">
            <label className="text-emerald-600 dark:text-emerald-400 block">Playground Name</label>
            <input
              type="text"
              name="name"
              value={playgroundData.name}
              onChange={(e) => setPlaygroundData({ ...playgroundData, name: e.target.value })}
              className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-emerald-600 dark:text-emerald-400 block">Playground Price</label>
            <input
              type="number"
              name="price"
              value={playgroundData.price}
              onChange={(e) => setPlaygroundData({ ...playgroundData, price: e.target.value })}
              className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
            /> 
          </div>

          <div className="mb-4">
            <label className="text-emerald-600 dark:text-emerald-400 block">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={playgroundData.start_time}
              onChange={(e) => setPlaygroundData({ ...playgroundData, start_time: e.target.value })}
              className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-emerald-600 dark:text-emerald-400 block">End Time</label>
            <input
              type="time"
              name="end_time"
              value={playgroundData.end_time}
              onChange={(e) => setPlaygroundData({ ...playgroundData, end_time: e.target.value })}
              className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-emerald-600 dark:text-emerald-400 block">Description</label>
            <textarea
              name="description"
              value={playgroundData.description}
              onChange={(e) => setPlaygroundData({ ...playgroundData, description: e.target.value })}
              className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-emerald-600 dark:text-emerald-400 block">Playground Images</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handlePlaygroundImagesChange}
              className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSavePlaygroundChanges}
              className="py-2 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring focus:border-emerald-300"
              type="button"
            >
              Save Playground Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )}    
    </div>
  );
}

export default SuperProfile;
