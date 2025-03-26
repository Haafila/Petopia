import React, { useEffect, useState } from "react";
import axios from "axios";
import CancelAppointmentButton from "./CancelAppointmentButton"; // Import the button component

function AppointmentDetails({ appointment, onClose }) {
  const [petName, setPetName] = useState(null);
  const [isCanceled, setIsCanceled] = useState(false); // Track if appointment is canceled
  const [status, setStatus] = useState(appointment.status); // Add this line



  useEffect(() => {
    const fetchPetName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/appointments/petname/${appointment._id}`
        );
        setPetName(response.data.petName);
      } catch (error) {
        console.error("Error fetching pet name", error);
      }
    };

    if (appointment && appointment.petId) {
      fetchPetName();
    }
  }, [appointment]);

  const formattedDate = appointment.date ? appointment.date.split("T")[0] : "N/A";

  const handleCancelSuccess = () => {
    setIsCanceled(true); // Mark as canceled
    setStatus("Cancelled");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Appointment Details</h2>
        <p className="text-lg"><strong>Pet Name:</strong> {petName}</p>
        <p className="text-lg"><strong>Service:</strong> {appointment.serviceType}</p>
        <p className="text-lg"><strong>Date:</strong> {formattedDate}</p>
        <p className="text-lg"><strong>Time Slot:</strong> {appointment.time}</p>
        <p className="text-lg"><strong>Status:</strong> {status}</p>

        {/* Conditional Rendering for Different Service Types */}
        {appointment.serviceType === 'Grooming' && appointment.details.groomingType && (
          <p className="text-lg"><strong>Grooming Type:</strong> {appointment.details.groomingType}</p>
        )}
        {appointment.serviceType === 'Training' && appointment.details.trainingType && (
          <p className="text-lg"><strong>Training Type:</strong> {appointment.details.trainingType}</p>
        )}
        {appointment.serviceType === 'Medical' && appointment.details.medicalType && (
          <p className="text-lg"><strong>Medical Type:</strong> {appointment.details.medicalType}</p>
        )}
        {appointment.serviceType === 'Boarding' && appointment.details.boardingdetails && (
          <>
            <p className="text-lg"><strong>Boarding Start Date:</strong> {appointment.details.boardingdetails.startdate}</p>
            <p className="text-lg"><strong>Boarding End Date:</strong> {appointment.details.boardingdetails.enddate}</p>
          </>
        )}

        {/* Cancel Button */}

        <CancelAppointmentButton
          appointmentId={appointment._id}
          date={appointment.date}
          time={appointment.time}
          serviceType={appointment.serviceType}
          status={appointment.status}
          onCancelSuccess={handleCancelSuccess} // Pass the callback
          disabled={isCanceled} // Disable button if appointment is canceled
        />

        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-md text-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AppointmentDetails;










