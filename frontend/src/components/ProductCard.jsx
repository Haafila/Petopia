import React from 'react';
import { Link } from 'react-router-dom';

import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product }) => {  // Change "Product" to lowercase "product"
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <img 
        src={product.imageUrl || '../assets/no-image.jpg'}  // Update references to product
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-2">LKR {product.price.toFixed(2)}</p>
      
      <div className="flex justify-between items-center">
        <AddToCartButton productId={product._id} quantity={1} />
        
        <Link to={`/customer/products/${product._id}`} className="text-rose-500 hover:underline">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
