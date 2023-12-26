import React from 'react';
import hero from '../img/soccer.mp4';
import soccerBall from '../img/soccerBall1.png';
import '../App.css';

function Hero() {
  return (
    <div>
      <div className="relative min-h-screen flex items-center justify-center z-[-2]">
        <video
          className="w-full h-full object-cover absolute top-0 left-0"
          autoPlay
          muted
          loop
        >
          <source src={hero} type="video/mp4" />
        </video>
        <div className="hero-overlay absolute w-full h-full bg-black bg-opacity-30" />
        <div className="hero-content text-center text-neutral-content relative z-10">
          <div className="max-w-md mx-auto">
            <h1 className="mb-5 text-5xl lg:text-7xl font-bold text-emerald-500 fade-in">
              Wait
              <span className="loading-dots">
                <span className="dot"><img src={soccerBall} alt="soccer ball" /></span>
                <span className="dot"><img src={soccerBall} alt="soccer ball" /></span>
                <span className="dot"><img src={soccerBall} alt="soccer ball" /></span>
                <span className="dot"><img src={soccerBall} alt="soccer ball" /></span>
              </span>
            </h1>
            <p className="mb-5 text-white text-opacity-90 fade-in font-bold text-lg lg:text-xl xl:text-2xl">
              There are so many! Your stadium is just a few quick clicks away...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
