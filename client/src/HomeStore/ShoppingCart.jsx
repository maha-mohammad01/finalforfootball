// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutForm from '../Component/CheckoutForm';

// const Table = styled.table`
//   width: 100%;
// `;

// const Button = styled.button`
//   background-color: rgb(16 185 129);
//   color: white;
//   padding: 10px 20px;
//   text-align: center;
//   text-decoration: none;
//   display: inline-block;
//   font-size: 16px;
//   margin: 4px 2px;
//   cursor: pointer;
// `;

// const CheckboxContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 16px;
// `;

// const CheckboxLabel = styled.label`
//   margin-left: 8px;
//   color: rgb(16 185 129);
//   font-weight: bold;
// `;

// const Container = styled.div`
//   width: 100%;
//   max-width: 1200px;
//   margin: 0 auto;
// `;

// const ShoppingCartContainer = styled.div`
//   background-color: #fff;
//   padding: 8px;
//   margin-top: 32px;
// `;

// const SummaryContainer = styled.div`
//   background-color: #fff;
//   padding: 8px;
// `;

// const ResponsiveTable = styled(Table)`
//   @media (max-width: 768px) {
//     th,
//     td {
//       display: block;
//       width: 100%;
//     }
//   }
// `;

// const ShoppingCart = ({ onAddToCart }) => {
//   const [cart, setCart] = useState([]);
//   const [delivery, setDelivery] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // If products are passed via location state, add them to the cart
//     if (location.state && location.state.products) {
//       onAddToCart(location.state.products);
//     }

//     // Fetch cart data from the server
//     fetch('http://localhost:2000/ViewCart')
//       .then((response) => response.json())
//       .then((data) => {
//         // Initialize the cart with quantity property
//         setCart(data.map((product) => ({ ...product, quantity: 1 })));
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   }, [location.state, onAddToCart]);

//   const updateQuantity = (productId, newQuantity) => {
//     // Update quantity for a specific product in the cart
//     setCart((prevCart) =>
//       prevCart.map((product) =>
//         product.id === productId ? { ...product, quantity: newQuantity } : product
//       )
//     );
//   };

//   const removeProduct = (productId) => {
//     // Remove a product from the cart
//     setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
//   };

//   const calculateTotal = () => {
//     // Calculate the total amount, considering the quantity and delivery
//     let total = cart.reduce((acc, product) => {
//       const productPrice = (product && product.price) || 0;
//       const productQuantity = (product && product.quantity) || 0;
//       return acc + productPrice * productQuantity;
//     }, 0);

//     if (delivery) {
//       total += 10;
//     }

//     return total.toFixed(2);
//   };

//   return (
//     <Container>
//       <ShoppingCartContainer>
//         <h1 className="text-2xl font-semibold mb-4 mt-32">Shopping Cart</h1>
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Cart Table */}
//           <div className="md:w-3/4">
//             <div className="bg-white rounded-lg shadow-md p-6 mb-4">
//               <ResponsiveTable>
//                 <thead>
//                   <tr>
//                     <th className="text-left font-semibold">Product</th>
//                     <th className="text-left font-semibold">Price</th>
//                     <th className="text-left font-semibold">Quantity</th>
//                     <th className="text-left font-semibold">Total</th>
//                     <th className="text-left font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cart.map((product) => (
//                     <tr key={product.id}>
//                       {/* Product Details */}
//                       <td className="py-4">
//                         <div className="flex items-center">
//                           <img
//                             className="h-16 w-16 mr-4"
//                             src={product.image}
//                             alt="Product image"
//                           />
//                           <span className="font-semibold">{product.title}</span>
//                         </div>
//                       </td>
//                       {/* Price */}
//                       <td className="py-4">${product.price}</td>
//                       {/* Quantity */}
//                       <td className="py-4">
//                         <div className="flex items-center">
//                           <Button
//                             className="border rounded-md py-2 px-4 mr-2"
//                             onClick={() => updateQuantity(product.id, product.quantity - 1)}
//                           >
//                             -
//                           </Button>
//                           <span className="text-center w-8">{product.quantity}</span>
//                           <Button
//                             className="border rounded-md py-2 px-4 ml-2"
//                             onClick={() => updateQuantity(product.id, product.quantity + 1)}
//                           >
//                             +
//                           </Button>
//                         </div>
//                       </td>
//                       {/* Total */}
//                       <td className="py-4">${(product.price * product.quantity).toFixed(2)}</td>
//                       {/* Remove Button */}
//                       <td className="py-4">
//                         <Button
//                           className="bg-emerald-500 text-white py-2 px-4 rounded-md mr-2"
//                           onClick={() => removeProduct(product.id)}
//                         >
//                           Remove
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </ResponsiveTable>
//             </div>
//           </div>
//           {/* Order Summary */}
//           <div className="md:w-1/4">
//             <SummaryContainer>
//               <h2 className="text-lg font-semibold mb-4">Summary</h2>
//               {/* Subtotal */}
//               <div className="flex justify-between mb-2">
//                 <span>Subtotal</span>
//                 <span>${calculateTotal()}</span>
//               </div>
//               {/* Taxes */}
//               <div className="flex justify-between mb-2">
//                 <span>Taxes</span>
//                 <span>$1.99</span>
//               </div>
//               {/* Shipping */}
//               <div className="flex justify-between mb-2">
//                 <span>Shipping</span>
//                 <span>${delivery ? '10.00' : '0.00'}</span>
//               </div>
//               {/* Total Amount */}
//               <hr className="my-2" />
//               <div className="flex justify-between mb-2">
//                 <span className="font-semibold">Total</span>
//                 <span className="font-semibold">${(parseFloat(calculateTotal()) + 1.99).toFixed(2)}</span>
//               </div>
//               {/* Delivery Checkbox */}
//               <CheckboxContainer>
//                 <input
//                   type="checkbox"
//                   id="deliveryCheckbox"
//                   checked={delivery}
//                   onChange={() => setDelivery(!delivery)}
//                 />
//                 <CheckboxLabel htmlFor="deliveryCheckbox">Delivery</CheckboxLabel>
//               </CheckboxContainer>
//               {/* Checkout Button */}
//               <Button
//           className="bg-emerald-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
//           onClick={() =>
//             navigate('/Payment', {
//               state: { total: calculateTotal(), cart: cart },
//             })
//           }
//         >
//           Checkout
//         </Button>
//             </SummaryContainer>
//           </div>
//         </div>
//       </ShoppingCartContainer>
//     </Container>
//   );
// };

// export default ShoppingCart;


import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const Table = styled.table`
  width: 100%;
`;

const Button = styled.button`
  background-color: rgb(16 185 129);
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const CheckboxLabel = styled.label`
  margin-left: 8px;
  color: rgb(16 185 129);
  font-weight: bold;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ShoppingCartContainer = styled.div`
  background-color: #fff;
  padding: 8px;
  margin-top: 32px;
`;

const SummaryContainer = styled.div`
  background-color: #fff;
  padding: 8px;
`;

const ResponsiveTable = styled(Table)`
  @media (max-width: 768px) {
    th,
    td {
      display: block;
      width: 100%;
    }
  }
`;

const ShoppingCart = ({ token, onAddToCart }) => {
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:2000/ViewCart', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
}).catch((error) => console.error('Fetch error:', error));


          if (response.ok) {
            const data = await response.json();
            console.log('Cart items data:', data); // Log the data received from the server
            onAddToCart(data.cart_items);
            setCart(data.cart_items.map((product) => ({ ...product, quantity: 1 })));
          } else {
            console.error('Error fetching cart data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      }
    };

    fetchCartData();
  }, [token, onAddToCart]);

  const updateQuantity = (productId, newQuantity) => {
    // Update quantity for a specific product in the cart
    setCart((prevCart) =>
      prevCart.map((product) =>
        product.id_product === productId ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const removeProduct = (productId) => {
    // Remove a product from the cart
    setCart((prevCart) => prevCart.filter((product) => product.id_product !== productId));
  };

  const calculateTotal = () => {
    // Calculate the total amount, considering the quantity and delivery
    let total = cart.reduce((acc, product) => {
      const productPrice = (product && product.price) || 0;
      const productQuantity = (product && product.quantity) || 0;
      return acc + productPrice * productQuantity;
    }, 0);

    if (delivery) {
      total += 10;
    }

    return total.toFixed(2);
  };

  return (
    <Container>
      <ShoppingCartContainer>
        <h1 className="text-2xl font-semibold mb-4 mt-32">Shopping Cart</h1>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Cart Table */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <ResponsiveTable>
                <thead>
                  <tr>
                    <th className="text-left font-semibold">Product</th>
                    <th className="text-left font-semibold">Price</th>
                    <th className="text-left font-semibold">Quantity</th>
                    <th className="text-left font-semibold">Total</th>
                    {/* <th className="text-left font-semibold">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((product) => (
                    <tr key={product.id_product}>
                      {/* Product Details */}
                      <td className="py-4">
                        <div className="flex items-center">
                          <img
                            className="h-16 w-16 mr-4"
                            src={product.images} // Assuming 'images' is the URL of the product image
                            alt="Product image"
                          />
                          <span className="font-semibold">{product.name}</span>
                        </div>
                      </td>
                      {/* Price */}
                      <td className="py-4">${product.price}</td>
                      {/* Quantity */}
                      <td className="py-4">
                        <div className="flex items-center">
                          <Button
                            className="border rounded-md py-2 px-4 mr-2"
                            onClick={() => updateQuantity(product.id_product, product.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="text-center w-8">{product.quantity}</span>
                          <Button
                            className="border rounded-md py-2 px-4 ml-2"
                            onClick={() => updateQuantity(product.id_product, product.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      {/* Total */}
                      <td className="py-4">${(product.price * product.quantity).toFixed(2)}</td>
                      {/* Remove Button */}
                      <td className="py-4">
                        <Button
                          className="bg-emerald-500 text-white py-2 px-4 rounded-md mr-2"
                          onClick={() => removeProduct(product.id_product)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ResponsiveTable>
            </div>
          </div>
          {/* Order Summary */}
          <div className="md:w-1/4">
            <SummaryContainer>
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              {/* Subtotal */}
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${calculateTotal()}</span>
              </div>
              {/* Taxes */}
              <div className="flex justify-between mb-2">
                <span>Taxes</span>
                <span>$1.99</span>
              </div>
              {/* Shipping */}
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>${delivery ? '10.00' : '0.00'}</span>
              </div>
              {/* Total Amount */}
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${(parseFloat(calculateTotal()) + 1.99).toFixed(2)}</span>
              </div>
              {/* Delivery Checkbox */}
              <CheckboxContainer>
                <input
                  type="checkbox"
                  id="delivery"
                  checked={delivery}
                  onChange={() => setDelivery(!delivery)}
                />
                <CheckboxLabel htmlFor="delivery">Delivery (+ $10.00)</CheckboxLabel>
              </CheckboxContainer>
              {/* Checkout Button */}
              <Button
                className="bg-emerald-500 text-white py-2 px-4 rounded-md"
                onClick={() => navigate('/checkout', { state: { cart, delivery } })}
              >
                Proceed to Checkout
              </Button>
            </SummaryContainer>
          </div>
        </div>
      </ShoppingCartContainer>
    </Container>
  );
};

export default ShoppingCart;
