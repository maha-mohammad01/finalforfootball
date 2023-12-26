import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AcademiesCards() {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [filteredPlaygrounds, setFilteredPlaygrounds] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    location: '',
    rating: '',
    ageofcatagory: '',
  });
  const [locations, setLocations] = useState([]);
  const [fieldSizes, setFieldSizes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3010/filterAcademies')
      .then((response) => {
        setPlaygrounds(response.data);
        setFilteredPlaygrounds(response.data);
        // Extract unique locations and field sizes from the data
        const uniqueLocations = [...new Set(response.data.map(playground => playground.location))];
        const uniqueFieldSizes = [...new Set(response.data.map(playground => playground.ageofcatagory))];
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

    if (filterCriteria.location) {
      filtered = filtered.filter(playground =>
        playground.location.toLowerCase().includes(filterCriteria.location.toLowerCase())
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

    if (filterCriteria.ageofcatagory) {
      filtered = filtered.filter(playground =>
        playground.ageofcatagory === filterCriteria.ageofcatagory
      );
    }

    setFilteredPlaygrounds(filtered);
  };

  const handleLocationChange = (e) => {
    setFilterCriteria({ ...filterCriteria, location: e.target.value });
  };

  const handleRatingChange = (e) => {
    setFilterCriteria({ ...filterCriteria, rating: e.target.value });
  };

  const handleFieldSizeChange = (e) => {
    setFilterCriteria({ ...filterCriteria, ageofcatagory: e.target.value });
  };

  return (
    <div className="min-h-[80vh] bg-white py-6 flex flex-col justify-center sm:py-2 mt-52">
      <div className="py-3 sm:max-w-xl sm:mx-auto mb-96">
        {/* Dropdown for filtering locations */}
        <div className="relative inline-flex mb-4">
          <select
            value={filterCriteria.location}
            onChange={handleLocationChange}
            className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
          >
            <option value="">All Locations</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Dropdown for filtering rating */}
        <div className="relative inline-flex mb-4">
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

        {/* Dropdown for filtering field size */}
        <div className="relative inline-flex mb-4">
          <select
            value={filterCriteria.ageofcatagory}
            onChange={handleFieldSizeChange}
            className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
          >
            <option value="">All Sizes</option>
            {fieldSizes.map((size, index) => (
              <option key={index} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Flex container for stacking cards horizontally */}
        <div className="flex flex-wrap justify-center">
          {filteredPlaygrounds.map((playground, index) => (
            <div key={playground.id} className="mb-6">
              <div className="bg-white shadow-lg border-gray-100 max-h-80 border sm:rounded-3xl p-8 flex space-x-20">
                <div className="h-48 overflow-visible w-1/2">
                  <img className="rounded-3xl shadow-lg" src={playground.image} alt={playground.name} />
                </div>
                <div className="flex flex-col w-1/2 space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold">{playground.name}</h2>
                    <div className="bg-yellow-400 font-bold rounded-xl p-2">{playground.rating}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Location: {playground.location}</div>
                    <div className="text-sm text-gray-400">Age Of Category: {playground.ageofcatagory}</div>
                  </div>
                  <p className="text-gray-400 max-h-40 overflow-y-hidden">{playground.description}</p>
                  <div className="flex text-2xl font-bold text-a">{`${playground.price} JOD`}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AcademiesCards;
