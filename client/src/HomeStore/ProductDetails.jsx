import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3010/product/${id}`)
        .then(response => {
          setProduct(response.data);
        })
        .catch(error => {
          console.error('Error fetching product details:', error);
          setError(`Error fetching product details: ${error.message}`);
        });
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <section className="overflow-hidden bg-white py-11 font-poppins dark:bg-gray-800 mt-16">
      <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 md:w-1/2 ">
            <div className="sticky top-0 z-50 overflow-hidden">
              <div className="relative mb-6 lg:mb-10 lg:h-2/4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-cover w-full lg:h-full"
                />
              </div>
              <div className="flex-wrap hidden md:flex">
                <div className="w-1/2 p-2 sm:w-1/4">
                  <a
                    href="#"
                    className="block border border-blue-300 dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-cover w-full lg:h-20 z-5"
                    />
                  </a>
                </div>
                {/* يمكنك تكرار البلوك السابق لعرض المزيد من الصور */}
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2">
            <div className="lg:pl-20">
              <div className="mb-8">
                <span className="text-lg font-medium text-rose-500 dark:text-rose-200">
                  New
                </span>
                <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold dark:text-gray-400 md:text-4xl">
                  {product.title}
                </h2>
                <div className="flex items-center mb-6">
                  {/* أيقونات التقييم */}
                  <p className="max-w-md mb-8 text-gray-700 dark:text-gray-400">
                    {product.description}
                  </p>
                  <p className="inline-block mb-8 text-4xl font-bold text-gray-700 dark:text-gray-400">
                    <span>${product.price}</span>
                    <span className="text-base font-normal text-gray-500 line-through dark:text-gray-400">
                      ${product.originalPrice}
                    </span>
                  </p>
                  <p className="text-green-600 dark:text-green-300 ">
                    {product.stock} in stock
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-8">
                <h2 className="w-16 mr-6 text-xl font-bold dark:text-gray-400">
                  Colors:
                </h2>
                {/* ألوان المنتج */}
              </div>
              <div className="flex items-center mb-8">
                <h2 className="w-16 text-xl font-bold dark:text-gray-400">Size:</h2>
                {/* أحجام المنتج */}
              </div>
              <div className="w-32 mb-8 ">
                <label
                  htmlFor=""
                  className="w-full text-xl font-semibold text-gray-700 dark:text-gray-400"
                >
                  Quantity
                </label>
                <div className="relative flex flex-row w-full h-10 mt-4 bg-transparent rounded-lg">
                  {/* حقل الكمية */}
                </div>
              </div>
              <div className="flex flex-wrap items-center -mx-4 ">
                <div className="w-full px-4 mb-4 lg:w-1/2 lg:mb-0">
                  <button className="flex items-center justify-center w-full p-4 text-emerald-500 border border-emerald-500 rounded-md dark:text-gray-200 dark:border-emerald-600 hover:bg-emerald-600 hover:border-emerald-600 hover:text-gray-100 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:hover:border-emerald-700 dark:hover:text-gray-300">
                    Add to Cart
                  </button>
                </div>
                <div className="w-full px-4 mb-4 lg:mb-0 lg:w-1/2">
                  <button className="flex items-center justify-center w-full p-4 text-emerald-500 border border-emerald-500 rounded-md dark:text-gray-200 dark:border-emerald-600 hover:bg-emerald-600 hover:border-emerald-600 hover:text-gray-100 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:hover:border-emerald-700 dark:hover:text-gray-300">
                    Add to wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
