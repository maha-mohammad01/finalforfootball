import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BestSalary({ onAddToCart, onAddToWishlist }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:2000/products')
      .then(response => {
        setProducts(response.data.slice(0, 4));
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
        setError(`Error fetching product data: ${error.message}`);
      });
  }, []);

  const handleAddToCart = (product) => {
    const cartItem = {
      name: product.name,
      price: product.price,
      images: product.images,
    };

    axios.post('http://localhost:3010/cart', cartItem)
      .then(response => {
        console.log('Product added to cart:', response.data);
        onAddToCart(product);
        showToast('Product added to cart!');
      })
      .catch(cartError => {
        console.error('Error adding product to cart:', cartError);
        showToast(`Error adding product to cart: ${cartError.message}`, 'error');
      });
  };

  const handleAddToWishlist = (product) => {
    onAddToWishlist(product);
    showToast('Product added to wishlist!');
  };

  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <div className="best-seller-section">
        <h1 className="best-seller-title">Best Salary</h1>
        <hr className="orange-line" />
      </div>
      <section className="flex items-center py-20 bg-gray-70 lg:h-[60vh] dark:bg-gray-800 mt-16">
        <div className="px-4 mx-auto max-w-7xl mb-32">
          <div className="grid grid-cols-1 gap-4 lg:gap-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id_product} className="relative overflow-hidden bg-white shadow rounded-xl dark:bg-gray-700 mt-12">
                <div className="relative overflow-hidden">
                  <div className="mb-5 overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        className="object-cover w-full mx-auto transition-all rounded h-72 hover:scale-110"
                        src={product.images}
                        alt=""
                      />
                    </Link>
                  </div>
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="absolute top-0 left-0 p-3 bg-emerald-500 rounded-l-none hover:bg-emerald-600 rounded-t-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="currentColor"
                      className="text-white"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                      />
                    </svg>
                  </button>
                </div>
                <h3 className="px-5 mb-4 text-lg font-bold dark:text-white">
                  {product.name}
                </h3>
                <div className="flex">
                  <div className="w-1/2 px-5 pb-3">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
                      ${product.price}
                    </p>
                    <span className="block -mt-1 text-xs font-semibold text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                  {product.buttonText && (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 text-sm text-white transition-all bg-emerald-600 rounded-r-none hover:bg-teal-600 rounded-t-xl"
                    >
                      Add to Cart
                      {/* {product.buttonText} */}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}

export default BestSalary;
