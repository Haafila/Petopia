import React, { useEffect, useState } from 'react';
import { TiShoppingCart } from "react-icons/ti";
import { useCart } from '../context/CartContext';
import { Link } from "react-router-dom";
import CheckoutButton from '../components/CheckoutButton';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const [quantities, setQuantities] = useState({});

  // Initialize quantities state when cart loads
  useEffect(() => {
    if (cart?.items) {
      const initialQuantities = {};
      cart.items.forEach(item => {
        initialQuantities[item._id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  // Ensure valid quantity (min 1)
  const handleQuantityChange = (itemId, value) => {
    const newValue = Math.max(1, Number(value)); // Prevents negative values
    setQuantities(prev => ({ ...prev, [itemId]: newValue }));
  };

  // Handle update and refresh
  const handleUpdate = async (itemId) => {
    await updateQuantity(itemId, quantities[itemId]); // Calls API and auto-refreshes
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="p-4 px-20">
      <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-between">
        <div className="flex items-center">
          Shopping Cart <span className="ml-2"><TiShoppingCart /></span>
        </div>
        <Link to="/customer/products" className="text-rose-400 text-lg hover:underline text-sm">
          ← Back to Shop
        </Link>
      </h2>

      {cartCount === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart?.items?.map((item) => (
            <div key={item._id} className="border bg-stone-200 p-4 mb-2 flex rounded justify-between items-center">
              {/* Product Details */}
              <div>
                <h3 className="text-lg">{item.product.name}</h3>
                <p>Price: LKR {item.product.price}</p>
                <p>Total: LKR {(item.product.price * item.quantity).toFixed(2)}</p>
              </div>

              {/* Quantity & Actions */}
              <div className="flex space-x-4">
                {/* Quantity Input */}
                <input
                  type="number"
                  min="1"
                  value={quantities[item._id] || 1}
                  onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  className="border px-2 py-1 w-16 text-center"
                />

                {/* Update Button */}
                <button
                  onClick={() => handleUpdate(item._id)}
                  className="border bg-orange-300 text-white px-4 py-1 rounded"
                >
                  Update
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="border bg-red-400 text-white px-4 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Cart Total */}
          <div className="mt-4">
            <h3 className="text-xl font-bold">Total: LKR {cartTotal.toFixed(2)}</h3><br />
            <CheckoutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
