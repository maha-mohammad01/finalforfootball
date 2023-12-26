import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cardsground() {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [filteredPlaygrounds, setFilteredPlaygrounds] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    city: '',
    rating: '',
    size: '',
  });
  const [city, setLocations] = useState([]);
  const [size, setFieldSizes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [playgroundsPerPage] = useState(8);

  useEffect(() => {
    axios.get('http://localhost:2000/stadiums')
      .then((response) => {
        setPlaygrounds(response.data);
        setFilteredPlaygrounds(response.data);
        const uniqueLocations = [...new Set(response.data.map(playground => playground.city))];
        const uniqueFieldSizes = [...new Set(response.data.map(playground => playground.size))];
        setLocations(uniqueLocations);
        setFieldSizes(uniqueFieldSizes);
      })
      .catch((error) => {
        console.error('Error fetching playgrounds:', error);
      });
  }, []);

  useEffect(() => {
    filterPlaygrounds();
  }, [filterCriteria]);

  const filterPlaygrounds = () => {
    let filtered = [...playgrounds];

    if (filterCriteria.city) {
      filtered = filtered.filter(playground =>
        playground.city.toLowerCase().includes(filterCriteria.city.toLowerCase())
      );
    }

    if (filterCriteria.rating) {
      filtered = filtered.sort((a, b) => {
        if (filterCriteria.rating === 'lowToHigh') {
          return a.rating - b.rating;
        } else {
          return b.rating - a.rating;
        }
      });
    }

    if (filterCriteria.size) {
      filtered = filtered.filter(playground =>
        playground.size == filterCriteria.size
      );
    }

    setFilteredPlaygrounds(filtered);
    setCurrentPage(1);
  };

  const handleLocationChange = (e) => {
    setFilterCriteria({ ...filterCriteria, city: e.target.value });
  };

  const handleRatingChange = (e) => {
    setFilterCriteria({ ...filterCriteria, rating: e.target.value });
  };

  const handleFieldSizeChange = (e) => {
    setFilterCriteria({ ...filterCriteria, size: e.target.value });
  };

  const indexOfLastPlayground = currentPage * playgroundsPerPage;
  const indexOfFirstPlayground = indexOfLastPlayground - playgroundsPerPage;
  const currentPlaygrounds = filteredPlaygrounds.slice(indexOfFirstPlayground, indexOfLastPlayground);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className="min-h-screen bg-white py-6 flex flex-col justify-center sm:py-2 mb-[-20] mt-32"
      style={{ background: 'url("https://img.freepik.com/premium-photo/soccer-ball-with-smoke-dark-background_972628-201.jpg?ga=GA1.1.848883340.1702820322&semt=ais_ai_generated")', backgroundRepeat:"no-repeat",backgroundSize:" cover"}}
    >     <div className="py-6 flex flex-col justify-center sm:py-2 mb-[-20] mt-32">
        <div className="py-3 sm:max-w-8xl sm:mx-auto">
          <div className="relative inline-flex mb-10">
            <select
              value={filterCriteria.city}
              onChange={handleLocationChange}
              className="inline-flex items-center justify-center h-10 gap-8 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
            >
              <option value="">All city</option>
              {city.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="relative inline-flex mb-4 ml-8" style={{ backgroundColor: 'gray' }}>
            <select
              value={filterCriteria.rating}
              onChange={handleRatingChange}
              className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
            >
              <option value="">All Ratings</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>

          <div className="relative inline-flex mb-4 ml-8">
            <select
              value={filterCriteria.size}
              onChange={handleFieldSizeChange}
              className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
            >
              <option value="">All Sizes</option>
              {size.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ml-40 mr-40 mt-16">
            {currentPlaygrounds.map((playground, index) => (
              <div key={playground.id} className="mb-6">
                <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md transition-transform transform hover:scale-105">
                  <div className="relative mx-4 -mt-6 h-56 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40">
                    <img
                      src={playground.images_url && playground.images_url.length > 0 ? playground.images_url[0] : 'عنوان_الصورة_الافتراضي'}
                      alt={playground.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                      {playground.name} - {playground.city}
                    </h5>
                    <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                      Size : {playground.size}
                    </h5>
                    <p className="block font-sans text-base leading-relaxed text-inherit antialiased font-bold">
                      Price : {playground.hourly_rate} JOD
                    </p>
                    <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                      {playground.description}
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <Link to={`/details/${playground.stadium_id}`}>
                      <button
                        className="select-none rounded-lg bg-emerald-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        data-ripple-light="true"
                      >
                        Details More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            {[...Array(Math.ceil(filteredPlaygrounds.length / playgroundsPerPage)).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`ml-2 py-2 px-4 font-medium text-white bg-emerald-500 rounded transition duration-300 focus:outline-none hover:bg-emerald-600 ${currentPage === number + 1 ? 'bg-emerald-700' : ''}`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cardsground;
