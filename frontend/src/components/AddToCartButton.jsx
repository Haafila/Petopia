import React from 'react';
import axios from 'axios';

const AddToCartButton = ({ productId, quantity }) => {  // Accept quantity as a prop
  const handleAddToCart = async () => {
    try {
      const response = await axios.post('/api/cart/add', {
        productId,
        quantity, 
      });

      if (response.data.success) {
        console.log('Added to cart:', productId, 'Quantity:', quantity);
        alert('Product added to cart!');
      } else {
        console.error('Failed to add to cart:', response.data.message);
        alert('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred. Please try again.');
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
