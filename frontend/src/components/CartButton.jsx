import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const CartButton = () => {
    const navigate = useNavigate();

    return (
        <button
            className="flex items-center text-lg text-white hover:bg-pink-400 bg-pink-800 p-3 rounded-lg"
            onClick={() => navigate("/customer/products/cart")}
        >
            <FaShoppingCart className="mr-5 text-4xl text-white stroke-white stroke-5" />
        </button>
    );
};

export default CartButton;
