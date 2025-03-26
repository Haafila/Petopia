import React from "react";
import { useNavigate } from "react-router-dom";

function ServiceType() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-10 min-h-screen p-6" style={{ backgroundColor: "var(--background-light)" }}>
      <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--dark-brown)" }}>Select a Service</h2>
      <div className="grid grid-cols-2 gap-6 w-140">
        <button
          className="w-full py-15 text-lg rounded-lg shadow-md hover:opacity-80 transition"
          style={{ backgroundColor: "var(--main-color)", color: "var(--white)" }}
          onClick={() => navigate("/customer/bookGrooming")}
        >
          Grooming
        </button>
        <button
          className="w-full py-15 text-lg rounded-lg shadow-md hover:opacity-80 transition"
          style={{ backgroundColor: "var(--light-purple)", color: "var(--dark-brown)" }}
          onClick={() => navigate("/customer/bookTraining")}
        >
          Training
        </button>
        <button
          className="w-full py-15 text-lg rounded-lg shadow-md hover:opacity-80 transition"
          style={{ backgroundColor: "var(--puppy-brown)", color: "var(--white)" }}
          onClick={() => navigate("/customer/bookMedical")}
        >
          Medical
        </button>
        <button
          className="w-full py-15 text-lg rounded-lg shadow-md hover:opacity-80 transition"
          style={{ backgroundColor: "var(--light-brown)", color: "var(--dark-brown)" }}
          onClick={() => navigate("/customer/bookBoarding")}
        >
          Boarding
        </button>
      </div>
    </div>
  );
}

export default ServiceType;
