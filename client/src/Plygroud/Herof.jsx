import React from 'react';
import playg from '../img/playg.mp4';
import '../App.css';

function Herof() {
  return (
    <div className='h-screen'>
      <div className="relative min-h-[40vh] flex items-center justify-center z-[-2]">
        <video
          className="w-full h-full object-cover absolute top-0 left-0"
          autoPlay
          muted
          loop
        >
          <source src={playg} type="video/mp4" />
        </video>
        <div className="hero-overlay absolute w-full h-full bg-black bg-opacity-30" />
        <div className="hero-content text-center text-neutral-content relative z-10">

        </div>
      </div>
    </div>
  );
}

export default Herof;
