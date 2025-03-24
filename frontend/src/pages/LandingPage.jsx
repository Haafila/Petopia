import React from 'react';

const LandingPage = () => {
  return (
      <div className="relative min-h-[calc(100vh-120px)] flex items-center">
        <div className="absolute inset-0 bg-pink-200 opacity-50 z-0"></div>
        <div className="container mx-auto grid grid-cols-2 items-center relative z-10">
          <div className="pr-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Welcome to Petopia</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your one-stop solution for all pet care needs. Schedule vet visits, 
              track health records, and connect with fellow pet owners. Join us and 
              give your pets the best care they deserve!
            </p>
            <div className="space-x-4">
              <button className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors">
                Learn More
              </button>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors">
                Adopt Now
              </button>
            </div>
          </div>
          <div>
            <img 
              src="../assets/homebg.webp" 
              alt="Petopia Pets" 
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
  );
};

export default LandingPage;