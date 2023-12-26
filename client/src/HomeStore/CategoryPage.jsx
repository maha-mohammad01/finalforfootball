import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CategoryPage() {
  const { categorySlug } = useParams();
  const [catalog, setCatalog] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ['Sports supplies', 'Sale', 'Football shoes', 'Player category', 'Sportswear'];
  const [activeFilters, setActiveFilters] = useState([]);

  const handleAddToWishlist = (product) => {
    console.log('Added to wishlist:', product);
  };

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3010/Catalogs');
        const catalogs = response.data;

        const categoryCatalog = catalogs.find(
          (catalog) => catalog.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
        );

        setCatalog(categoryCatalog);
        setFilteredProducts(categoryCatalog.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [categorySlug]);

  const handleFilterChange = (filter) => {
    if (activeFilters.includes(filter)) {
      // Remove filter if it's already active
      const updatedFilters = activeFilters.filter((item) => item !== filter);
      setActiveFilters(updatedFilters);
    } else {
      // Add filter if it's not active
      setActiveFilters([...activeFilters, filter]);
    }
  };

  useEffect(() => {
    // Apply filters
    let filtered = catalog ? catalog.products : [];

    if (activeFilters.length > 0) {
      filtered = catalog.products.filter((product) =>
        activeFilters.some((filter) => product.title.includes(filter))
      );
    }

    setFilteredProducts(filtered);
  }, [activeFilters, catalog]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!catalog) {
    return <div className="text-center mt-8">Category not found</div>;
  }

  return (
    <div className="container mx-auto mt-32 flex">
      {/* Sidebar */}
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold mb-2">Filter By:</h2>
        <ul>
          {filters.map((filter) => (
            <li
              key={filter}
              className={`cursor-pointer mb-2 ${
                activeFilters.includes(filter) ? 'text-teal-500 font-bold' : ''
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-4">
        {catalog && (
          <>
            <h1 className="text-4xl font-bold mb-6">{catalog.name}</h1>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 lg:gap-4 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="mt-10 p-4 bg-white rounded shadow dark:bg-gray-700 border border-green-500"
                  >
                    <div className="relative z-20 group">
                      <div className="relative block h-64 mb-4 overflow-hidden rounded">
                        <img
                          className="object-cover w-full h-full transition-all group-hover:scale-110"
                          src={product.image}
                          alt={product.title}
                        />
                      </div>
                      <a href="#">
                        <h2 className="mb-2 text-xl font-bold text-black dark:text-white">
                          {product.title}
                        </h2>
                      </a>
                      <p className="mb-3 text-lg font-bold text-teal-500 dark:text-teal-300">
                        <span>${product.price}</span>
                        <span className="text-xs font-semibold text-gray-400 line-through">
                          ${product.discountedPrice}
                        </span>
                      </p>
                      <div className="flex gap-1 text-orange-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className={`bi bi-star${star <= product.rating ? '-fill' : ''}`}
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
