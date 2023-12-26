import React, { useState, useEffect } from 'react';
import axios from 'axios';

// استيراد المكونات الخاصة بالصفحة
import Header from '../HomeStore/Header1';
import HeroStore from '../HomeStore/HeroStore';
import Category from '../HomeStore/Category';
import WoCatogery from '../HomeStore/WoCatogery';
import BestSalary from '../HomeStore/BestSalary';
import Adssec from '../HomeStore/Adssec';
import Shosepro from '../HomeStore/Shosepro';
import BestSa from '../HomeStore/BestSa';
import Shose from '../HomeStore/Shose';
import BarAds from '../HomeStore/BarAds';
import Hproduct from '../HomeStore/Hproduct';
import WoHpro from '../HomeStore/WoHpro';
import OpinCs from '../HomeStore/OpinCs';
import Wocs from '../HomeStore/Wocs';
import Banner from '../HomeStore/Banner';
import Collction from '../HomeStore/Collction';

function Store() {
  // الحالات والمتغيرات
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // استدعاء البيانات من الخادم باستخدام Axios
    axios.get('http://localhost:3010/Product')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = () => {
    // إضافة إلى السلة
    setCartCount(cartCount + 1);
  };

  const handleAddToWishlist = () => {
    // إضافة إلى قائمة الرغبات
    setHeartCount(heartCount + 1);
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      // left: 0,
      right:10,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div>
      <Banner/>
      {/* رأس الصفحة */}
      <Header cartCount={cartCount} heartCount={heartCount} />

      {/* بقية المكونات */}
      <HeroStore />
      <WoCatogery />
      <Category />
      <br></br><br></br><br></br><br></br>

      {/* أفضل الرواتب */}
      {/* <BestSa /> */}
      {products.length > 0 && <BestSalary onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />}

      {/* إعلانات */}
      <Adssec />
      <Shose />
      {products.length > 0 && <Shosepro onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />}
      <Collction/>

      <BarAds />
      <WoHpro/>

{products.length > 0 && <Hproduct onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist}/>} 
      {/* مكونات أخرى */}
      {/* ... */}

      <Wocs />
      <OpinCs />
    </div>
  );
}

export default Store;
