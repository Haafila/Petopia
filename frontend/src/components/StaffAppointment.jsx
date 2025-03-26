import React, { useEffect, useState } from "react";
import axios from "axios";

function StaffAppointmentList({ serviceType }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/appointments/${serviceType}`
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [serviceType]);

  const markAsCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:5000/appointments/complete/${id}`, {
        status: "Completed",
      });
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "Completed" } : appt
        )
      );
    } catch (error) {
      console.error("Error updating appointment status", error);
    }
  };



  return (
    <div className="p-4 bg-[var(--white)] rounded-md shadow-sm max-w-md mx-auto mt-20">
      <h2 className="text-xl font-semibold mb-3 text-[var(--dark-brown)]">
        {serviceType} Appointments
      </h2>

      {loading ? (
        <p className="text-[var(--dark-brown)]">Loading...</p>
      ) : appointments.length > 0 ? (
        <table className="w-full border-collapse border border-[var(--grey)] bg-[var(--white)] rounded-md text-sm">
          <thead>
            <tr className="bg-[var(--light-brown)] text-[var(--dark-brown)]">
              {serviceType === "Boarding" ? (
                <>
                  <th className="border border-[var(--grey)] p-1">Start Date</th>
                  <th className="border border-[var(--grey)] p-1">End Date</th>
                </>
              ) : (
                <>
                  <th className="border border-[var(--grey)] p-1">Date</th>
                  <th className="border border-[var(--grey)] p-1">Time</th>
                </>
              )}
              <th className="border border-[var(--grey)] p-1">Status</th>
              <th className="border border-[var(--grey)] p-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="text-center">
                {serviceType === "Boarding" ? (
                  <>
                    <td className="border border-[var(--grey)] p-1">
                      {appointment.details.boardingDetails.startDate.split("T")[0]}
                    </td>
                    <td className="border border-[var(--grey)] p-1">
                      {appointment.details.boardingDetails.endDate.split("T")[0]}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-[var(--grey)] p-1">
                      {appointment.date.split("T")[0]}
                    </td>
                    <td className="border border-[var(--grey)] p-1">
                      {appointment.time}
                    </td>
                  </>
                )}
                <td className="border border-[var(--grey)] p-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${appointment.status === "Booked"
                        ? "text-yellow-800"
                        : appointment.status === "Confirmed"
                          ? "text-blue-800"
                          : appointment.status === "Completed"
                            ? "text-green-800"
                            : appointment.status === "Cancelled"
                              ? "text-red-800"
                              : "text-gray-800"
                      }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="border border-[var(--grey)] p-1">
                  {appointment.status === "Confirmed" && (
                    <button
                      onClick={() => markAsCompleted(appointment._id)}
                      className="bg-[var(--puppy-brown)] text-[var(--white)] px-2 py-1 rounded-sm text-xs hover:py-2"
                    >
                      Complete
                    </button>
                  )}
                  {(appointment.status === "Completed" ||
                    appointment.status === "Cancelled" ||
                    appointment.status === "Booked") && (
                      <span className="text-gray-500 text-xs">not allowed</span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-[var(--dark-brown)]">No appointments found.</p>
      )}
    </div>

  );
}

export default StaffAppointmentList;
