import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Boarding() {
   const navigate = useNavigate();
   //const [userId] = useState("67d7dda581850a0c88ab9b77"); 
   const [pets, setPets] = useState([]);
   const [petId, setPetId] = useState("");
   const [serviceType] = useState("Boarding");
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");

   const [session, setSession] = useState({ _id: '', email: '' });
      
        useEffect(() => {
          const fetchSession = async () => {
            try {
              const response = await fetch('/api/users/session', {
                credentials: 'include', 
              });
              const data = await response.json();
              console.log('Session data:', data); 
              setSession(data);
            } catch (error) {
              console.error('Error fetching session:', error);
            }
          };
          fetchSession();
        }, []);
   
      const userId = session._id;


   useEffect(() => {
      axios.get(`http://localhost:5000/appointments/pets/${userId}`)
         .then(response => setPets(response.data))
         .catch(error => console.error("Error fetching pets:", error));
   }, [userId]);


   const today = new Date().toISOString().split("T")[0];

   function setData(e) {
      e.preventDefault();

      // start date is not in the past
      if (startDate < today) {
         alert("Start date cannot be in the past.");
         return;
      }

      // end date is after start date
      if (endDate <= startDate) {
         alert("End date must be after the start date.");
         return;
      }

      const boardingDetails = { startDate, endDate };
      const details = { boardingDetails };
      const newAppointment = { petId, userId, serviceType, details };

      axios.post("http://localhost:5000/appointments/add", newAppointment)
         .then(() => alert("Appointment Booked Successfully"))
         .catch(err => alert(err));
   }

   return (
       <div className="p-4" style={{ backgroundColor: 'var(--main-color)', color: 'var(--grey)' }}>

        <button onClick={() => navigate("/customer/ServiceType")} className="bg-[var(--dark-brown)] text-white py-2 px-4 rounded-md hover:bg-[var(--light-brown)] transition-colors duration-300 ease-in-out">Back</button>

         <div className="bg-[var(--background-light)] p-6 rounded-lg shadow-md max-w-md mx-auto mt-20 mb-48">

            <h2 className="text-xl font-semibold text-[var(--dark-brown)] mb-4">
               Book Boarding Appointment
            </h2>

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
                  <label htmlFor="startDate" className="block text-[var(--dark-brown)] font-medium">
                     Start Date:
                  </label>
                  <input
                     type="date"
                     id="startDate"
                     name="details.boardingDetails.startDate"
                     min={(() => {
                        const today = new Date();
                        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
                           .toISOString()
                           .split("T")[0];
                        return localDate;
                     })()} 
                     onChange={(e) => setStartDate(e.target.value)}
                     required
                     className="w-full p-2 border border-[var(--light-grey)] rounded-md bg-white"
                  />
               </div>



               <div>
                  <label htmlFor="endDate" className="block text-[var(--dark-brown)] font-medium">
                     End Date:
                  </label>
                  <input
                     type="date"
                     id="endDate"
                     name="details.boardingDetails.endDate"
                     min={startDate || today} //after start date
                     onChange={(e) => setEndDate(e.target.value)}
                     required
                     className="w-full p-2 border border-[var(--light-grey)] rounded-md bg-white"
                  />
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

export default Boarding;
