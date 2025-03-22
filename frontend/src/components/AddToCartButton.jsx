import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddToCartButton = ({ productId, quantity }) => {  // Accept quantity as a prop
  const handleAddToCart = async () => {
    try {
      const response = await axios.post('/api/cart/add', {
        productId,
        quantity, 
      });

      if (response.data.success) {
        console.log('Added to cart:', productId, 'Quantity:', quantity);
        toast.success('Product added to cart!');
      } else {
        console.error('Failed to add to cart:', response.data.message);
        toast.error('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <button
      className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
