import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Sale',
    path: '/category/sportswear',
    imageSrc: 'https://cdn.salla.sa/form-builder/2WlrkG2EnsGFeGAFtrCcbdIp20KauN5r8oKlL15G.png',
  },
  {
    id: 2,
    name: 'Sports supplies',
    path: '/category/sports-supplies',
    imageSrc: 'https://cdn.salla.sa/form-builder/GMYLTyssiC1bn4NWnvdaY3METmZyrmudm0H0ELOG.png',
  },
  {
    id: 3,
    name: 'Football shoes',
    path: '/category/football-shoes',
    imageSrc: 'https://cdn.salla.sa/form-builder/ChwRBYVfd4LbMmr9KWPDHNK0RCspPqCTnufAAmJX.png',
  },
  {
    id: 4,
    name: 'Player category',
    path: '/category/player-category',
    imageSrc: 'https://cdn.salla.sa/form-builder/HOiCFroVP1ICK6zbw38HvTLUWT8DW25v6xlycqN5.png',
  },
  {
    id: 5,
    name: 'Sportswear',
    path: '/category/sportswear',
    imageSrc: 'https://cdn.salla.sa/form-builder/cpjNNr6g821p82hdKqQl566I9xjX8iomQjbRI3yh.png',
  },
  // ... add more categories as needed
];

function Category() {
  return (
    <section className="bg-white py-16 mt-7">
      <div className="container mx-auto relative z-[3+]">
        <header className="text-center mb-8 text-black">
          <h2 className="text-4xl font-bold">Discover Our Unique Collections</h2>
        </header>

        <div className="flex justify-between">
          {categories.map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-md shadow-md flex-1">
              <Link to={category.path} className="block">
                <img
                  src={category.imageSrc}
                  alt={category.name}
                  className="w-full h-64 object-cover transition duration-300 transform group-hover:scale-105 rounded-t-md"
                />
              </Link>
              <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 transition duration-300 opacity-0 group-hover:opacity-100 rounded-md">
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-sm text-white mb-2">Category Description or Additional Information</p>
                <Link
                  to={category.path}
                  className="px-6 py-2 bg-white text-black text-sm font-medium uppercase transition duration-300 hover:bg-gray-300 rounded-md"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Category;
