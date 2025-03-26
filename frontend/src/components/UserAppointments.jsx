import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentDetails from "./AppointmentDetails";

function UserAppointments() {
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);



  useEffect(() => {
    const userId = "67d7dda581850a0c88ab9b77";

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/appointments/user/${userId}`);
        setAppointments({
          upcoming: response.data.upcomingAppointments,
          past: response.data.pastAppointments,
        });
      } catch (error) {
        console.error("Error fetching appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);



  if (loading) return <div className="text-center p-4">Loading...</div>;



  return (
    <div className="p-4" style={{ backgroundColor: 'var(--main-color)' }}>

      <div className="flex justify-center items-center  bg-background-light mb-20 mt-10">
        <div className="overflow-x-auto max-h-140">
          <div className="p-3 bg-[var(--background-light)] rounded-lg shadow-md w-400 max-w-lg ">


            {/* Upcoming Appointments */}
            <h3 className="text-md font-semibold text-dark-brown border-b pb-1 mb-2">Upcoming Appointments</h3>
            <ul className="space-y-1">
              {appointments.upcoming.length > 0 ? (
                appointments.upcoming.map((appointment) => (
                  <li key={appointment.appointmentId} className="p-2 bg-light-grey rounded-md shadow-sm text-sm flex justify-between">
                    <span className="text-dark-brown">
                      {appointment.serviceType} on {appointment.date.split("T")[0]} at {appointment.time}
                      <br />
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${appointment.status === "Booked"
                            ? "bg-yellow-200 text-yellow-800"
                            : appointment.status === "Confirmed"
                              ? "bg-blue-200 text-blue-800"
                              : appointment.status === "Completed"
                                ? "bg-green-200 text-green-800"
                                : appointment.status === "Cancelled"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-gray-200 text-gray-800"
                          }`}
                      >
                        Status: {appointment.status}
                      </span>
                    </span>
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="px-1 py-1 text-white bg-blue-400 hover:bg-blue-700 rounded-md text-xs"
                    >
                      View
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-sm text-grey">No upcoming appointments.</p>
              )}
            </ul>



            {/* Past Appointments */}
            <h3 className="text-md font-semibold text-dark-brown border-b pb-1 mt-4 mb-2">Past Appointments</h3>
            <ul className="space-y-1">
              {appointments.past.length > 0 ? (
                appointments.past.map((appointment) => (
                  <li key={appointment.appointmentId} className="p-2 bg-light-grey rounded-md shadow-sm text-sm flex justify-between">
                    <span className="text-dark-brown">
                      {appointment.serviceType} on {appointment.date.split("T")[0]} at {appointment.time}
                      <br />
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${appointment.status === "Booked"
                            ? " text-yellow-800"
                            : appointment.status === "Confirmed"
                              ? "text-blue-800"
                              : appointment.status === "Completed"
                                ? "text-green-800"
                                : appointment.status === "Cancelled"
                                  ? "text-red-800"
                                  : "text-gray-800"
                          }`}
                      >
                        Status:{appointment.status}
                      </span>
                    </span>
                    <button
                      onClick={() => {
                        console.log("Selected Appointment:", appointment);
                        setSelectedAppointment(appointment);
                      }}
                      className="px-2 py-1 text-white bg-blue-500 hover:bg-blue-700 rounded-md text-xs"
                    >
                      View
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-sm text-grey">No past appointments.</p>
              )}
            </ul>
          </div>
        </div>



        {selectedAppointment && (
          <AppointmentDetails
            appointment={selectedAppointment}  // Pass the full appointment object
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </div>
    </div>

  );
}

export default UserAppointments;
