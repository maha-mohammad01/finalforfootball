import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Component/Home';
import Login from './Users/Login';
import Footer from './Component/Footer';
import Header from './Component/Header';
import SignUp from './Users/Signup';
import Store from './Component/Store';
import Playgrounds from './Component/Playgrounds';
import ProductDetails from './HomeStore/ProductDetails';
import Academies from './Component/Academies';
import ForgotPassword from './Users/ForgotPassword';
import StadiumDetails from './Plygroud/StadiumDetails';
import BookingForm from './Plygroud/BookingForm';
import PaymentForm from './Payment';
import Profile from './Profile/UserProfile';
import ShoppingCart from './HomeStore/ShoppingCart';
import Addformplay from './Home/Addformplay';
import Price from './Home/Price';
import Category from '../src/HomeStore/Category';
import CategoryPage from '../src/HomeStore/CategoryPage';
import ContactUs from './Component/ContactUs';
import AboutUs1 from './Component/AboutUs1';
import Done from './Home/Done';
import Notfound from './Component/Notfound';
import Categoryage from '../src/HomeStore/CategoryPage';
import SuperProfile from './Profile/SuperUsers';
import FAQs from './Component/FAQs';
import Whyus from './Component/Whyus';
import Category1 from './HomeStore/Category1';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') ? true : false
  );

  return (
    <div className="App">
      <Router>
        <Header isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/aboutus" element={<AboutUs1 />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/category" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/categoryp" element={<Categoryage />} />
          <Route path="/details/:id" element={<StadiumDetails />} />
          <Route path="/store" element={<Store />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/academies" element={<Academies />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/playgrounds" element={<Playgrounds />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/whyus" element={<Whyus />} />
          <Route path="/category1" element={<Category1 />} />



          

          {isAuthenticated && (
            <>
              <Route path="/playgrounds" element={<Playgrounds />} />
              <Route path="/profile1" element={<SuperProfile />} />
              <Route path="/bookingform/:id" element={<BookingForm />} />
              <Route path="/Payment" element={<PaymentForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/price" element={<Price />} />
              <Route path="/addformplay" element={<Addformplay />} />
              <Route path="/shoppingcart" element={<ShoppingCart />} />
              <Route path="/done" element={<Done />} />
            </>
          )}

          <Route path="*" element={<Notfound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
