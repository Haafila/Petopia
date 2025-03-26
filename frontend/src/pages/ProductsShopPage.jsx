import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CartButton from '../components/CartButton';
import ReactPaginate from 'react-paginate';

const ProductsShopPage = () => {
    const [products, setProducts] = useState([]);
    const [categories] = useState(['All', 'Accessories', 'Toys', 'Housing', 'Food', 'Health', 'Others']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8; 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products'); 
                console.log("API Response:", response.data); // for debugging
                if (response.data && Array.isArray(response.data.data)) {
                    setProducts(response.data.data);
                } else {
                    throw new Error("API did not return an array");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products");
            } finally {
                setLoading(false); 
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => 
        (selectedCategory === 'All' || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const offset = currentPage * itemsPerPage;
    const currentProducts = filteredProducts.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    // Handle page change
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    if (loading) return <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading Products...</p>
                        </div>;
    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

    return (
        <div className="container mx-auto px-6 py-8">
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

            {/* Search and Category Filter */}
            <div className="mb-8 flex flex-wrap gap-4 items-center">
                {/* Search Input */}
                <div className="flex-grow">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="w-full px-4 py-2 border border-rose-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                </div>

                {/* Category Buttons */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setCurrentPage(0);
                            }}
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
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No products found
                </div>
            )}

            {/* Pagination Component */}
            {filteredProducts.length > itemsPerPage && (
                <div className="flex justify-center mt-8 py-4">
                    <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination flex gap-2"}
                        pageClassName={"px-4 py-2 border rounded bg-pink-300 hover:bg-gray-300"}
                        activeClassName={"bg-rose-400 text-white"}
                        previousClassName={"px-4 py-2 border rounded bg-white hover:bg-gray-300"}
                        nextClassName={"px-4 py-2 border rounded bg-white hover:bg-gray-300"}
                        disabledClassName={"opacity-50 cursor-not-allowed"}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductsShopPage;