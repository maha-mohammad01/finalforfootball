import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bacjer from '../img/bacjer.PNG';


function CardAcademy() {
  const [latestCards, setLatestCards] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3010/Academies')
      .then((response) => {
        setLatestCards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching latest cards:', error);
      });
  }, []);

  useEffect(() => {
    // Add event listener for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth',
        });
      });
    });
  }, []);

  return (
    <div
    style={{
      width: '90%',
      height:'70%',
      margin: 'auto',
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      alignItems: 'center', // Center items vertically
      backgroundColor: '#20EA52',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1600 800\'%3E%3Cg stroke=\'%23000000\' stroke-width=\'66.7\' stroke-opacity=\'0.08\' %3E%3Ccircle fill=\'%2320EA52\' cx=\'0\' cy=\'0\' r=\'1800\'/%3E%3Ccircle fill=\'%2321db4e\' cx=\'0\' cy=\'0\' r=\'1700\'/%3E%3Ccircle fill=\'%2322cc4a\' cx=\'0\' cy=\'0\' r=\'1600\'/%3E%3Ccircle fill=\'%2322bd46\' cx=\'0\' cy=\'0\' r=\'1500\'/%3E%3Ccircle fill=\'%2323ae42\' cx=\'0\' cy=\'0\' r=\'1400\'/%3E%3Ccircle fill=\'%2322a03d\' cx=\'0\' cy=\'0\' r=\'1300\'/%3E%3Ccircle fill=\'%23229139\' cx=\'0\' cy=\'0\' r=\'1200\'/%3E%3Ccircle fill=\'%23218335\' cx=\'0\' cy=\'0\' r=\'1100\'/%3E%3Ccircle fill=\'%23207631\' cx=\'0\' cy=\'0\' r=\'1000\'/%3E%3Ccircle fill=\'%231f682c\' cx=\'0\' cy=\'0\' r=\'900\'/%3E%3Ccircle fill=\'%231e5b28\' cx=\'0\' cy=\'0\' r=\'800\'/%3E%3Ccircle fill=\'%231c4e23\' cx=\'0\' cy=\'0\' r=\'700\'/%3E%3Ccircle fill=\'%2319421f\' cx=\'0\' cy=\'0\' r=\'600\'/%3E%3Ccircle fill=\'%2317351b\' cx=\'0\' cy=\'0\' r=\'500\'/%3E%3Ccircle fill=\'%23142a16\' cx=\'0\' cy=\'0\' r=\'400\'/%3E%3Ccircle fill=\'%23111e11\' cx=\'0\' cy=\'0\' r=\'300\'/%3E%3Ccircle fill=\'%23091309\' cx=\'0\' cy=\'0\' r=\'200\'/%3E%3Ccircle fill=\'%23000100\' cx=\'0\' cy=\'0\' r=\'100\'/%3E%3C/g%3E%3C/svg%3E")',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
    }}
      className="relative mt-10 p-2 rounded-lg"
    >
      {latestCards.map((card) => (
        <div
          key={card.id}
          className="overflow-hidden bg-white rounded-md shadow-md text-slate-900 shadow-slate-200 mb-4 animate-card hover:animate-card-hover cursor-pointer"
          onClick={() => {
            // Placeholder onClick handler
            console.log(`Clicked on card with ID ${card.id}`);
            // Add your logic for handling the button click, e.g., navigate to more details page
          }}
          style={{
            flex: '0 0 22%',
            maxWidth: '22%',
            marginBottom: '1rem',
            borderRadius: '12px',
            position: 'relative',
            transition: 'transform 0.3s ease-out',
          }}
        >
          <div className="relative">
            <img src={card.image} alt={card.name} className="aspect-video w-full rounded-t-md" />
            <div className="absolute top-0 right-0 p-3 bg-emerald-600">
              <svg
                className="w-4 h-4 text-yellow-300 me-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <p className="text-2xs font-medium text-white">{card.rating}</p>
            </div>
          </div>
          <div className="p-3">
            <h3 className="text-sm font-semibold mb-1">{card.name}</h3>
            <p className="text-xs opacity-75 mb-2">{card.location}</p>
          </div>
          <div className="flex justify-between items-center p-3">
        
            <button
              className="bg-emerald-500 text-white p-2 rounded-md transition duration-300 hover:bg-emerald-600 shadow-md"
              onClick={() => {
                // Handle button click, e.g., navigate to more details page
              }}
            >
              More Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardAcademy;

