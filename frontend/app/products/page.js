'use client';
import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        categoryId: 1,
        unitPrice: '',
        stockQty: '',
        reorderLevel: 10,
        description: ''
    });

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getProducts({ search });
            if (response.success) {
                setProducts(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch products from server');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await productService.createProduct(formData);
            if (res.success) {
                setIsOpenModal(false);
                fetchProducts();
                setFormData({ sku: '', name: '', categoryId: 1, unitPrice: '', stockQty: '', reorderLevel: 10, description: '' });
            } else {
                alert(res.message);
            }
        } catch (err) {
            alert('Error creating product');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Product & Inventory Management</h1>
                <button 
                    onClick={() => setIsOpenModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Add Product
                </button>
            </div>

            {/* Search & Filters */}
            <div className="mb-6 flex gap-4">
                <input 
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Loading & Error States */}
            {loading && <p className="text-gray-500">Loading products...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Products Table */}
            {!loading && !error && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                                <th className="p-3">SKU</th>
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Unit Price (LKR)</th>
                                <th className="p-3">Stock Qty</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                                        <td className="p-3 font-medium text-gray-900">{product.sku}</td>
                                        <td className="p-3">{product.name}</td>
                                        <td className="p-3">LKR {Number(product.unit_price).toFixed(2)}</td>
                                        <td className={`p-3 font-bold ${product.stock_qty <= product.reorder_level ? 'text-red-600' : 'text-green-600'}`}>
                                            {product.stock_qty} {product.stock_qty <= product.reorder_level && '(Low Stock)'}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Product Modal */}
            {isOpenModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">SKU</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.sku}
                                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                    className="w-full border border-gray-300 rounded p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full border border-gray-300 rounded p-2 mt-1"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        required 
                                        value={formData.unitPrice}
                                        onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                                        className="w-full border border-gray-300 rounded p-2 mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Initial Stock Qty</label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={formData.stockQty}
                                        onChange={(e) => setFormData({...formData, stockQty: e.target.value})}
                                        className="w-full border border-gray-300 rounded p-2 mt-1"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsOpenModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}