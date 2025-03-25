import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Medical() {
   const navigate = useNavigate();
   const [userId, setUserId] = useState("67d7dda581850a0c88ab9b77");
   const [pets, setPets] = useState([]);
   const [petId, setPetId] = useState("");
   const [serviceType] = useState("Medical");
   const [MedicalServiceType, setMedicalServiceType] = useState("");
   const [date, setDate] = useState("");
   const [time, setTime] = useState("");
   const [bookedSlots, setBookedSlots] = useState([]);


   const timeSlots = [
      "09:00 AM-09:30 AM", "09:30 AM-10:00 AM", "10:00 AM-10:30 AM", "10:30 AM-11:00 AM",
      "11:00 AM-11:30 AM", "11:30 AM-12:00 PM", "02:00 PM-02:30 PM", "02:30 PM-03:00 PM",
      "03:00 PM-03:30 PM", "03:30 PM-04:00 PM"
   ];



   useEffect(() => {
      axios.get(`http://localhost:5000/appointments/pets/${userId}`)
         .then(response => {
            setPets(response.data);
         })
         .catch(error => console.error("Error fetching pets:", error));
   }, [userId]);


   // get booked slots when date change
   useEffect(() => {
      if (date) {
         axios.get(`http://localhost:5000/timeslots/bookedSlots?date=${date}&serviceType=${serviceType}`)
            .then(response => setBookedSlots(response.data.map(slot => slot.slot)))
            .catch(error => console.error("Error fetching booked slots:", error));
      }
   }, [date, serviceType]);



   function setData(e) {
      e.preventDefault();

      if (!petId || !MedicalServiceType || !date || !time) {
         alert("Please fill in all required fields.");
         return;
      }


      const bookedSlotData = { date, serviceType, slot: time };


      axios.post("http://localhost:5000/timeslots/bookSlot", bookedSlotData)
         .then(() => {

            // after successfully booked, then create the appointment
            const details = { MedicalServiceType };
            const newAppointment = { petId, userId, serviceType, details, date, time };

            axios.post("http://localhost:5000/appointments/add", newAppointment)
               .then(() => {

                  alert("Appointment Booked Successfully!");

                  setPetId("");
                  setMedicalServiceType("");
                  setDate("");
                  setTime("");

               })
               .catch(err => {
                  alert("Failed to book appointment.");
                  console.error("Error adding appointment:", err);
               });
         })
         .catch(err => {
            alert("Failed to book the time slot. It might be already taken.");
            console.error("Error booking slot:", err);
         });
   }



   return (
      <div className="p-4" style={{ backgroundColor: 'var(--main-color)', color: 'var(--grey)' }}>
         <button onClick={() => navigate("/customer/ServiceType")} className="bg-[var(--dark-brown)] text-white py-2 px-4 rounded-md hover:bg-[var(--light-brown)] transition-colors duration-300 ease-in-out">Back</button>
         <div className="bg-[var(--background-light)] p-6 rounded-lg shadow-md max-w-md mx-auto mt-15 mb-30">
            <h2 className="text-xl font-semibold text-[var(--dark-brown)] mb-4">Book Medical Appointment</h2>

            <form onSubmit={setData} className="space-y-4">


               <div>
                  <label htmlFor="petId" className="block text-[var(--dark-brown)] font-medium">Select Pet:</label>
                  <select
                     id="petId"
                     name="petId"

                     onChange={(e) => setPetId(e.target.value)}
                     required
                     className="w-full p-2 border border-[var(--light-grey)] rounded-md bg-white"
                  >
                     <option value="">--Select Your Pet--</option>
                     {pets.map((pet) => (
                        <option key={pet._id} value={pet._id}>{pet.name}</option>
                     ))}
                  </select>
               </div>



               <div>
                  <label htmlFor="medicalType" className="block text-[var(--dark-brown)] font-medium">
                     Type of Medical Service:
                  </label>
                  <select
                     id="medicalType"
                     name="details.medicalType"
                     value={MedicalServiceType}
                     onChange={(e) => setMedicalServiceType(e.target.value)}
                     required
                     className="w-full p-2 border border-[var(--light-grey)] rounded-md bg-white"
                  >
                     <option value="">--Select Service--</option>
                     <option value="Vaccination">Vaccination</option>
                     <option value="Routine Check-up">Routine Check-up</option>
                     <option value="Emergency">Emergency</option>
                  </select>
               </div>



               {/* Select Date */}
               <div>
                  <label htmlFor="date" className="block text-[var(--dark-brown)] font-medium">Preferred Date:</label>
                  <input
                     type="date"
                     id="date"
                     name="date"
                     value={date}
                     required
                     onChange={(e) => setDate(e.target.value)}
                     min={(() => {
                        const today = new Date();
                        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
                           .toISOString()
                           .split("T")[0];
                        return localDate;
                     })()}
                     className="w-full p-2 border border-[var(--light-grey)] rounded-md bg-white"
                  />
               </div>




               {/* Select Time Slot */}
               <div>
                  <label htmlFor="time" className="block text-[var(--dark-brown)] font-medium">Preferred Time Slot:</label>
                  <select
                     id="time"
                     name="time"
                     value={time}
                     onChange={(e) => setTime(e.target.value)}
                     required
                     className="w-full p-2 border border-[var(--light-grey)] rounded-md bg-white"
                  >
                     <option value="">--Select a Time Slot--</option>
                     {timeSlots.map(slot => (
                        <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                           {slot} {bookedSlots.includes(slot) ? "(Booked)" : "(Available)"}
                        </option>
                     ))}
                  </select>
               </div>



               <button
                  type="submit"
                  className="w-full bg-[var(--main-color)] text-white py-2 rounded-md font-semibold hover:bg-[var(--puppy-brown)] transition"
               >
                  Book Appointment
               </button>


            </form>

         </div>
      </div>


   );
}

export default Medical;
