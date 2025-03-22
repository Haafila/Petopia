import { Link } from "react-router-dom";
import { useState } from "react"; // To manage the toggle state
import { FaClipboardList, FaBars, FaPaw, FaCalendarAlt, FaQuestionCircle, FaSignOutAlt, FaUser, FaShoppingCart, FaHeart } from "react-icons/fa"; // Import icons
import { IoPawSharp } from "react-icons/io5";

const CustomerSideBar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage navbar open/close

  const toggleNavbar = () => setIsOpen(!isOpen); // Toggle function for the navbar

  return (
    <div className="flex h-147">
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
                    to="/account"
                    className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
                    >
                    {isOpen ? <FaUser className="mr-3" /> : <FaUser />} {isOpen && "My Account"}
                    </Link>
                </li>
                <li>
                    <Link
                    to="/mypets"
                    className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
                    >
                    {isOpen ? <FaPaw className="mr-3" /> : <FaPaw />} {isOpen && "My Pets"}
                    </Link>
                </li>
                <li>
                    <Link
                    to="/customer/products"
                    className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
                    >
                    {isOpen ? <FaShoppingCart className="mr-3" /> : <FaShoppingCart />} {isOpen && "Shop Now"}
                    </Link>
                </li>
                <li>
                    <Link
                    to="/appointment"
                    className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
                    >
                    {isOpen ? <FaCalendarAlt className="mr-3" /> : <FaCalendarAlt />} {isOpen && "Book an Appointment"}
                    </Link>
                </li>
                <li>
                    <Link
                    to="/adopt"
                    className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
                    >
                    {isOpen ? <FaHeart className="mr-3" /> : <FaHeart />} {isOpen && "Adopt a Friend"}
                    </Link>
                </li>
                <li>
                    <Link
                    to="/customer/orders"
                    className="flex items-center text-white hover:bg-rose-400 p-2 rounded block"
                    >
                    {isOpen ? <FaClipboardList className="mr-3" /> : <FaClipboardList />} {isOpen && "My Orders"}
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
    </div>
  );
};

export default CustomerSideBar;