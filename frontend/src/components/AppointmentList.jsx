import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentFilter from "./FilterAppointment";
import AppointmentActions from "./AppointmentAction";

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [filter, setFilter] = useState({
    status: "",
    serviceType: "",
    });

    useEffect(() => {
        axios.get("http://localhost:5000/appointments/")
            .then((response) => {
                setAppointments(response.data);
                setFilteredAppointments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching appointments:", error);
            })
            .finally(() => {
                setLoading(false);  // Set loading to false after the request completes
            });
    }, []); 


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => {
          const newFilter = { ...prevFilter, [name]: value };
          applyFilter(newFilter);
          return newFilter;
        });
      };

      

      const applyFilter = (newFilter) => {
        let filtered = appointments;
    
        if (newFilter.status) {
          filtered = filtered.filter(
            (appointment) => appointment.status === newFilter.status
          );
        }
    
        if (newFilter.serviceType) {
          filtered = filtered.filter(
            (appointment) => appointment.serviceType === newFilter.serviceType
          );
        }
    
        setFilteredAppointments(filtered);
      };


      const updateStatusInState = (id, newStatus) => {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === id ? { ...appointment, status: newStatus } : appointment
          )
        );
        setFilteredAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === id ? { ...appointment, status: newStatus } : appointment
          )
        );
      };
    


    if (loading) return <div className="text-center py-10 font-bold">Loading...</div>;

    return (
        <div className="admin-dashboard bg-[--background-light] min-h-screen p-8">
           <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-3xl font-bold text-[--dark-brown] text-center mb-6">
              All Appointments
            </h2>

    <AppointmentFilter filter={filter} onFilterChange={handleFilterChange} />

    <div className="overflow-x-auto max-h-110">  
      <table className="w-full border-collapse rounded-lg shadow-sm">
        <thead>
          <tr className="bg-[--puppy-brown] text-[--dark-brown] uppercase text-sm">
            <th className="px-6 py-3 text-left font-bold">Pet Name</th>
            <th className="px-6 py-3 text-left font-bold">Pet Owner's Name</th>
            <th className="px-6 py-3 text-left font-bold">Service Type</th>
            <th className="px-6 py-3 text-left font-bold">Details</th>
            <th className="px-6 py-3 text-left font-bold">Date</th>
            <th className="px-6 py-3 text-left font-bold">Time Slot</th>
            <th className="px-6 py-3 text-left font-bold">Status</th>
            <th className="px-6 py-3 text-left font-bold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.map((appointment, index) => (
            <tr
              key={appointment._id}
              className={`border-b ${
                index % 2 === 0 ? "bg-[--light-grey]" : "bg-[--light-purple]"
              }`}
            >
              <td className="px-6 py-4 text-[--dark-brown] font-medium">
                {appointment.petId?.name || "Unknown Pet"}
              </td>
              <td className="px-6 py-4 text-[--dark-brown] font-medium">
                {appointment.userId?.name || "Unknown User"}
              </td>
              <td className="px-6 py-4">{appointment.serviceType}</td>
              <td className="px-6 py-4">
                {appointment.details ? (
                  appointment.serviceType === "Grooming" ? (
                    appointment.details.groomingType
                  ) : appointment.serviceType === "Training" ? (
                    appointment.details.trainingType
                  ) : appointment.serviceType === "Medical" ? (
                    appointment.details.medicalType
                  ) : appointment.serviceType === "Boarding" &&
                    appointment.details.boardingDetails ? (
                    `${new Date(appointment.details.boardingDetails.startDate)
                      .toISOString()
                      .split("T")[0]} to 
                       ${new Date(appointment.details.boardingDetails.endDate)
                         .toISOString()
                         .split("T")[0]}`
                  ) : (
                    "No details available"
                  )
                ) : (
                  "No details available"
                )}
              </td>

              <td className="px-6 py-4">
                {appointment.date ? appointment.date.split("T")[0] : "N/A"}
              </td>
              <td className="px-6 py-4">{appointment.time}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appointment.status === "Booked"
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
                  {appointment.status}
                </span>
              </td>
              <td className="px-6 py-4">
                    {/* Use AppointmentActions component */}
                    <AppointmentActions
                      appointmentId={appointment._id}
                      currentStatus={appointment.status}
                      date={appointment.date}
                      time={appointment.time}
                      serviceType={appointment.serviceType}
                      onStatusUpdate={updateStatusInState}
                    />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

    );
}

export default AppointmentList;
