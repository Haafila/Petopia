import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import AddToCartButton from '../components/AddToCartButton';
import CartButton from '../components/CartButton';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        if (response.data && response.data.data) {
          setProduct(response.data.data);
        } else {
          console.error('No product found in response data');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4 py-4">
        <CartButton />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div>No image available</div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl">LKR {product.price.toFixed(2)}</p>
          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center gap-4">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              className="w-20 px-3 py-2 border rounded"
            />
          </div>

          <div className="flex gap-4">
            <AddToCartButton productId={product._id} quantity={quantity} />
            <button className="bg-purple-400 text-white px-6 py-3 rounded hover:bg-purple-600"  style={{ display: 'none' }}>
              Buy Now
            </button>
          </div>

          <Link to="/customer/products" className="text-rose-400 hover:underline">
            &larr; Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
