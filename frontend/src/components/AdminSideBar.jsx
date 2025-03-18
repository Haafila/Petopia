import { Link } from "react-router-dom";
import { useState } from "react"; // To manage the toggle state
import { FaBox, FaClipboardList, FaBars, FaTachometerAlt, FaUsers, FaPaw, FaCalendarAlt, FaDollarSign, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa"; // Import icons
import { IoPawSharp } from "react-icons/io5";

const AdminSideBar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage navbar open/close

  const toggleNavbar = () => setIsOpen(!isOpen); // Toggle function for the navbar

  return (
    <div className="flex h-screen">
      {/* Sidebar (Vertical Navbar) */}
      <div className={`p-5 space-y-6 transition-all duration-400 ${isOpen ? "w-65" : "w-18"}`} style={{ backgroundColor: 'var(--dark-brown)' }}>
        {/* Brand with Toggle Button */}
        <div className="flex justify-between items-center mb-6">
          {/* Brand */}
          {isOpen && (
            <div className="text-white text-2xl font-bold">
              <Link to="/" className="flex items-center">
                Petopia <IoPawSharp className="ml-2" />
              </Link>
            </div>
          )}
          {/* Toggle Button */}
          <div className="flex justify-end items-center">
            <button onClick={toggleNavbar} className="text-white text-2xl font-bold text-center">
              <FaBars />
            </button>
          </div>
        </div>

      {/* Links */}
      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaTachometerAlt className="mr-3" /> : <FaTachometerAlt />} {isOpen && "Dashboard"}
          </Link>
        </li>
        <li>
          <Link
            to="/users"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaUsers className="mr-3" /> : <FaUsers />} {isOpen && "Users"}
          </Link>
        </li>
        <li>
          <Link
            to="/pets"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaPaw className="mr-3" /> : <FaPaw />} {isOpen && "Pets"}
          </Link>
        </li>
        <li>
          <Link
            to="/appointments"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaCalendarAlt className="mr-3" /> : <FaCalendarAlt />} {isOpen && "Appointments"}
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaBox className="mr-3" /> : <FaBox />} {isOpen && "Products"}
          </Link>
        </li>
        <li>
          <Link
            to="/orders"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaClipboardList className="mr-3" /> : <FaClipboardList />} {isOpen && "Orders"}
          </Link>
        </li>
        <li>
          <Link
            to="/finance"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaDollarSign className="mr-3" /> : <FaDollarSign />} {isOpen && "Finance"}
          </Link>
        </li>
        <hr className="border-t border-gray-600 my-4" />
        <li>
          <Link
            to="/help"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaQuestionCircle className="mr-3" /> : <FaQuestionCircle />} {isOpen && "Help & Support"}
          </Link>
        </li>
        <li>
          <Link
            to="/logout"
            className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
          >
            {isOpen ? <FaSignOutAlt className="mr-3" /> : <FaSignOutAlt />} {isOpen && "Logout"}
          </Link>
        </li>
      </ul>
    </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Your main content will go here */}
      </div>
    </div>
  );
};

export default AdminSideBar;