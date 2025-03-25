import React from "react";

function AppointmentFilter({ filter, onFilterChange }) {
  return (
    <div className="mb-4">
      <label className="mr-2">Status:</label>
      <select
        name="status"
        value={filter.status}
        onChange={onFilterChange}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="">All</option>
        <option value="Booked">Booked</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <label className="ml-4 mr-2">Service Type:</label>
      <select
        name="serviceType"
        value={filter.serviceType}
        onChange={onFilterChange}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="">All</option>
        <option value="Grooming">Grooming</option>
        <option value="Training">Training</option>
        <option value="Medical">Medical</option>
        <option value="Boarding">Boarding</option>
      </select>
    </div>
  );
}

export default AppointmentFilter;
