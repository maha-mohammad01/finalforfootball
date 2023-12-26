import React from 'react';
import backgrou from '../img/twosection.PNG';

function Aboutus() {
  return (
    <div>
      <div className="hero min-h-[50vh] relative mt-24">
        <img
          src={backgrou}
          className="absolute w-90 h-[90%] top-[-3rem] bottom-[30rem] left-[36rem] z-[-1]"
          alt="Background"
        />
        <div className="hero-content flex-col lg:flex-row items-center justify-center text-white gr relative">
          <div className="ml-5 grid grid-cols-2 items-start relative z-[-1]">
            <div className=" relative z-[-1] mr-32">
              <img
                src="https://middle-east-online.com/sites/default/files/styles/home_special_coverage_1920xauto/public/2020-06/20200523140115appp--acb00aad92b443ce9360946eeca319b3-acb00aad92b443ce9360946eeca319b3-entry.h.jpg?itok=Uml1QBYw"
                className="max-w-sm rounded-lg shadow-2xl mx-auto"
                alt="Football"
              />
            </div>
            <div className='flex flex-col justify-start items-start relative z-10'>
              <h1 className="text-5xl font-bold text-emerald-500 ">About Us</h1>
              <p className="py-5 text-black text-left font-bold">
                Welcome to Footbolia, your premier destination for all things football.<br/>
                Whether you're looking to book football pitches, improve your skills at top-level sports academies,<br/>
                or shop for high-quality sports equipment,<br/>
                Footbolia has you covered. Join us and embrace the beautiful experience.<br/>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
