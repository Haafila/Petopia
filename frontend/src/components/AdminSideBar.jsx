import { Link } from "react-router-dom";
import { useState } from "react"; // To manage the toggle state
import { FaHome, FaPlus, FaBox, FaClipboardList, FaBars, FaTimes } from "react-icons/fa"; // Import icons
import { IoPawSharp } from "react-icons/io5";

const AdminSideBar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage navbar open/close

  const toggleNavbar = () => setIsOpen(!isOpen); // Toggle function for the navbar

  return (
    <div className="flex h-screen">
      {/* Sidebar (Vertical Navbar) */}
      <div className={`p-5 space-y-6 transition-all duration-400 ${isOpen ? "w-65" : "w-18"}`} style={{ backgroundColor: 'var(--dark-brown)' }}>
        {/* Brand / Title with Toggle Button */}
        <div className="flex justify-between items-center mb-6">
          {/* Brand / Title */}
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
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Links */}
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
            >
              {isOpen ? <FaHome className="mr-3" /> : <FaHome />} {isOpen && "Home"}
            </Link>
          </li>
          <li>
            <Link
              to="/create"
              className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
            >
              {isOpen ? <FaPlus className="mr-3" /> : <FaPlus />} {isOpen && "Create"}
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