import React from 'react';
import { Link } from 'react-router-dom';

function Addtoregister() {
  return (
    <div>
<div class="bg-gradient-to-r from-emerald-700 to-emerald-500 w-[93%] mx-auto min-h-[400px] rounded-3xl p-6 text-white flex flex-col justify-center font-[sans-serif] overflow-hidden mt-16 mb-16">
      <div class="grid md:grid-cols-2 justify-center items-center max-md:text-center gap-8 h-full">
        <div class="max-w-md mx-auto">
          <h2 class="text-4xl md:text-5xl font-extrabold mb-6 md:!leading-[55px]">Just a few clicks to register your stadium</h2>
          <p class="text-base"></p>
          <div class="mt-10">
            <Link to="/addformplay">
            <button type="button"
              class="px-8 py-2 text-base tracking-wider font-semibold outline-none border border-white bg-white text-emerald-500 hover:bg-transparent hover:text-white transition-all duration-300">Resgister Your stadium</button></Link>
          </div>
        </div>
        <div class="md:text-right ">
          <img src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Premium Benefits" class="object-cover rounded-[10%]" />
        </div>
      </div>
    </div>
    </div>
  );
}

export default Addtoregister;
