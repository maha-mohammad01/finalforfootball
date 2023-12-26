import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Stor() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "50%",
          transform: "translateX(50%)",
        }}
      >
        <ul style={{ margin: "0" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          background: activeIndex === i ? "#1A9247" : "#ddd",
          margin: "0 8px",
        }}
      />
    ),
    activeDotClass: "slick-active",
  };

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <Slider {...settings} className="relative">
        <img
          src="https://cdn.sportshop.com/convert/storage/gallery/hero_desktop/1695105026Slider-Desktop_1903x635px-Voetbal-COM.jpg"
          alt="Football"
          className="h-full w-full object-cover rounded-xl"
        />
        <img
          src="https://cdn.sportshop.com/convert/storage/gallery/hero_desktop/1695105027Slider-Desktop_1903x635px-Running-COM.jpg"
          alt="Running"
          className="h-full w-full object-cover rounded-xl"
        />
        <img
          src="https://cdn.sportshop.com/convert/storage/gallery/hero_desktop/1695105027Slider-Desktop_1903x635px-Tennis-COM.jpg"
          alt="Tennis"
          className="h-full w-full object-cover rounded-xl"
        />
      </Slider>
    </div>
  );
}

export default Stor;
