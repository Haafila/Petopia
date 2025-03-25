import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState({ items: [] }); // Default to empty cart
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch latest cart data
  const fetchCart = async () => {
    setLoading(true);
    try {
      // Check authentication status first
      const sessionResponse = await axios.get("/api/users/user");
      setIsAuthenticated(true);

      // If authenticated, fetch cart
      const response = await axios.get("/api/cart");
      setCart(response.data.data || { items: [] }); 
    } catch (error) {
      console.error("Error fetching cart:", error);
      // If unauthorized, reset to default state
      setIsAuthenticated(false);
      setCart({ items: [] }); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(); 
  }, []);

  const addToCart = async (productId, quantity) => {
    if (!isAuthenticated) {
      console.warn("Cannot add to cart. User not authenticated.");
      return;
    }
    try {
      await axios.post("/api/cart/add", { productId, quantity });
      fetchCart(); // Refresh cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      console.warn("Cannot clear cart. User not authenticated.");
      return;
    }
    try {
      await axios.delete("/api/cart/clear"); 
      setCart({ items: [] }); 
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      console.warn("Cannot update quantity. User not authenticated.");
      return;
    }
    try {
      await axios.put(`/api/cart/update/${itemId}`, { quantity });
      fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      console.warn("Cannot remove from cart. User not authenticated.");
      return;
    }
    try {
      await axios.delete(`/api/cart/remove/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Compute total price
  const cartTotal = cart?.items?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  ) || 0;

  // Compute total item count
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        isAuthenticated, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        cartTotal, 
        cartCount, 
        cartItems, 
        setCartItems, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);