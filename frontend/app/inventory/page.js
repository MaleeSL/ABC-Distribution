'use client';
import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';

export default function InventoryPage() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const res = await productService.getProducts();
        if (res.success) setProducts(res.data);
    };

    const handleStockAdjustment = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !quantity) return alert('Select product and quantity');

        try {
            const res = await productService.adjustStock(selectedProduct, {
                quantity: parseInt(quantity),
                movementType: 'STOCK_IN',
                note: note || 'Manual stock adjustment'
            });

            if (res.success) {
                alert('Stock updated successfully!');
                setQuantity('');
                setNote('');
                loadProducts();
            } else {
                alert(res.message);
            }
        } catch (err) {
            alert('Failed to update stock');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Stock-In & Adjustment</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleStockAdjustment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                        <select 
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        >
                            <option value="">-- Choose Product --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.sku} - {p.name} (Current Stock: {p.stock_qty})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add (Stock-In)</label>
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="e.g. 50"
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note / Reference</label>
                        <input 
                            type="text" 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Supplier delivery / stock check"
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full font-medium"
                    >
                        Update Stock Level
                    </button>
                </form>
            </div>
        </div>
    );
}