import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

import CartButton from '../components/CartButton';

const ProductsShopPage = () => {
    const [products, setProducts] = useState([]);
    const [categories] = useState(['Accessories', 'Toys', 'Housing', 'Food', 'Health', 'Others']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products'); 
                console.log("API Response:", response.data); // Debugging
                if (response.data && Array.isArray(response.data.data)) {
                    setProducts(response.data.data);
                } else {
                    throw new Error("API did not return an array");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.category === selectedCategory);

    if (loading) return <div className="text-center py-8">Loading...</div>;

    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

    return (
        <div className="container h-100 mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8 p-4 rounded-lg min-h-[250px]" 
            style={{
                backgroundImage: 'url("../assets/pet-shop-banner.png")',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }}>
            <div className="flex justify-between items-center w-full mt-auto">
                <h1 className="text-5xl font-extrabold text-pink-950">Petopia Pet Shop</h1>
                <CartButton />
            </div>
        </div>
            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-4">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded ${
                            selectedCategory === category
                            ? 'bg-rose-400 text-white'
                            : 'bg-rose-200 hover:bg-rose-300'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No products found in this category
                </div>
            )}
        </div>
    );
};

export default ProductsShopPage;
