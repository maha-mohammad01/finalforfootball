import React, { useState, useEffect } from 'react';
import Hero from './Hero'
import WordGro from '../Home/WordGro'
import Cardsground from '../Home/Cardsground'
import Stor from '../Home/Stor'
import Wstor from '../Home/Wstor'
import CardAcademy from '../Home/CardAcademy'
import Wacademy from '../Home/Wacademy'
import Addtoregister from '../Home/Addtoregister'
import Features from './Features'



function Home() {
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <div>
      <Hero/>
      {/* <Aboutus/> */}
      <Features/>
      <WordGro/>
      <br></br>
      <Cardsground/>
      <br></br>
      <Wstor/>
      <br></br>
      <Stor/>
      <Wacademy/>
      <br></br>
      <CardAcademy/>
      <Addtoregister/>
     


    </div>
  )
}

export default Home
