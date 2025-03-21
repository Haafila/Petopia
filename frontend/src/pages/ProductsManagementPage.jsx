import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import ProductForm from '../components/ProductForm';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 7; 

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/products`);
            setProducts(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch products');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct._id}`, formData);
                toast.success('Product updated successfully');
            } else {
                await axios.post('/api/products', formData);
                toast.success('Product added successfully');
            }
            setIsFormOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error('Failed to save product');
        }
    };

    // Pagination Logic
    const offset = currentPage * itemsPerPage;
    const currentProducts = products.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(products.length / itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold mb-4">Product Management</h1>

            <button
                onClick={() => {
                    setEditingProduct(null);
                    setIsFormOpen(true);
                }}
                className="bg-rose-300 border text-white px-4 py-2 rounded mb-4 hover:bg-rose-400"
            >
                Add New Product
            </button>

            {isFormOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50">
                    <ProductForm
                        product={editingProduct}
                        onSubmit={handleFormSubmit}
                        onClose={() => setIsFormOpen(false)}
                    />
                </div>
            )}

            <div className="overflow-x-container h-100 mx-auto p-2">
                <table className="min-w-full bg-white border text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border w-35">Name</th>
                            <th className="px-4 py-2 border w-7">Price (LKR)</th>
                            <th className="px-4 py-2 border">Category</th>
                            <th className="px-4 py-2 border">Quantity</th>
                            <th className="px-4 py-2 border">Image</th>
                            <th className="px-4 py-2 border">Created At</th>
                            <th className="px-4 py-2 border">Updated At</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-4 py-2 border">{product.name}</td>
                                    <td className="px-4 py-2 border">{product.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 border">{product.category}</td>
                                    <td className="px-4 py-2 border">{product.quantity}</td>
                                    <td className="px-4 py-2 border"><a href={product.imageUrl} target="_blank" rel="noopener noreferrer" className='text-pink-400'>View Image</a></td>
                                    <td className="px-4 py-2 border">{new Date(product.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-2 border">{new Date(product.updatedAt).toLocaleString()}</td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center px-4 py-2 border">
                                    No products available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Component */}
            {products.length > itemsPerPage && (
                <div className="flex justify-center mt-8">
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
                        activeClassName={"bg-rose-300 text-white"}
                        previousClassName={"px-4 py-2 border rounded bg-white hover:bg-gray-300"}
                        nextClassName={"px-4 py-2 border rounded bg-white hover:bg-gray-300"}
                        disabledClassName={"opacity-50 cursor-not-allowed"}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductManagementPage;
