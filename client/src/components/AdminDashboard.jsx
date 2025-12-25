import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Settings State
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [newClass, setNewClass] = useState('');
    const [newDivision, setNewDivision] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        basePrice: '',
        category: '',
        description: '',
        image: '',
        nutrition: '',
        variants: []
    });

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'settings') {
            fetchSettings();
        }
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get('http://localhost:5001/api/orders', config);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5001/api/products');
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5001/api/settings');
            setClasses(data.classes);
            setDivisions(data.divisions);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleUpdateSettings = async (updatedClasses, updatedDivisions) => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.put('http://localhost:5001/api/settings', {
                classes: updatedClasses,
                divisions: updatedDivisions
            }, config);

            setClasses(updatedClasses);
            setDivisions(updatedDivisions);
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings');
        }
    };

    const handleAddClass = (e) => {
        e.preventDefault();
        if (newClass && !classes.includes(newClass)) {
            handleUpdateSettings([...classes, newClass], divisions);
            setNewClass('');
        }
    };

    const handleRemoveClass = (cls) => {
        if (window.confirm(`Delete class "${cls}"?`)) {
            handleUpdateSettings(classes.filter(c => c !== cls), divisions);
        }
    };

    const handleAddDivision = (e) => {
        e.preventDefault();
        if (newDivision && !divisions.includes(newDivision)) {
            handleUpdateSettings(classes, [...divisions, newDivision]);
            setNewDivision('');
        }
    };

    const handleRemoveDivision = (div) => {
        if (window.confirm(`Delete division "${div}"?`)) {
            handleUpdateSettings(classes, divisions.filter(d => d !== div));
        }
    };

    const handleRenameClass = (oldName) => {
        const newName = window.prompt("Enter new class name:", oldName);
        if (newName && newName !== oldName && newName.trim() !== "") {
            const updatedClasses = classes.map(c => c === oldName ? newName.trim() : c);
            handleUpdateSettings(updatedClasses, divisions);
        }
    };

    const handleRenameDivision = (oldName) => {
        const newName = window.prompt("Enter new division name:", oldName);
        if (newName && newName !== oldName && newName.trim() !== "") {
            const updatedDivisions = divisions.map(d => d === oldName ? newName.trim() : d);
            handleUpdateSettings(classes, updatedDivisions);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.put(`http://localhost:5001/api/orders/${orderId}/status`, { status: newStatus }, config);
            setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.delete(`http://localhost:5001/api/products/${id}`, config);
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const payload = {
                ...formData,
                nutrition: formData.nutrition.split(',').map(item => item.trim()),
                variants: formData.variants // Assuming variants logic is handled or simple for now
            };

            if (editingProduct) {
                const { data } = await axios.put(`http://localhost:5001/api/products/${editingProduct._id}`, payload, config);
                setProducts(products.map(p => p._id === editingProduct._id ? data : p));
            } else {
                const { data } = await axios.post('http://localhost:5001/api/products', payload, config);
                setProducts([...products, data]);
            }
            setShowProductForm(false);
            setEditingProduct(null);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            basePrice: '',
            category: '',
            description: '',
            image: '',
            nutrition: '',
            variants: []
        });
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setFormData({
            ...product,
            nutrition: product.nutrition.join(', '),
            variants: product.variants
        });
        setShowProductForm(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={onClose}
            ></div>

            <div className="w-full max-w-6xl glass-card rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-zoom-in h-[90vh] flex flex-col border border-white/20 dark:border-gray-700/50">
                {/* Header content */}
                <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="p-2.5 rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
                                <span className="material-symbols-rounded text-2xl">admin_panel_settings</span>
                            </span>
                            Admin Dashboard
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium ml-1">Manage orders and products</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                    >
                        <span className="material-symbols-rounded text-2xl group-hover:rotate-90 transition-transform duration-500">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-8 border-b border-gray-100 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`py-4 px-6 font-bold text-sm tracking-wide transition-all border-b-2 ${activeTab === 'orders' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`py-4 px-6 font-bold text-sm tracking-wide transition-all border-b-2 ${activeTab === 'products' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`py-4 px-6 font-bold text-sm tracking-wide transition-all border-b-2 ${activeTab === 'settings' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                    >
                        Settings
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50/50 dark:bg-gray-950/20">
                    {activeTab === 'orders' && (
                        // Orders View
                        loading ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
                                <p className="text-gray-500 font-bold animate-pulse">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                    <span className="material-symbols-rounded text-4xl">inventory_2</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No orders found</h3>
                                <p className="text-gray-500 dark:text-gray-400">When customers buy products, they will appear here.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                            <th className="px-6 py-4 text-sm font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Order ID</th>
                                            <th className="px-6 py-4 text-sm font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Customer</th>
                                            <th className="px-6 py-4 text-sm font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Date</th>
                                            <th className="px-6 py-4 text-sm font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Total</th>
                                            <th className="px-6 py-4 text-sm font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors group">
                                                <td className="px-6 py-6">
                                                    <span className="font-mono font-bold text-primary-600 dark:text-primary-400">#{order.orderId}</span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                                                            <span className="material-symbols-rounded text-xl">person</span>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-white">{order.student}</div>
                                                            <div className="text-xs text-gray-500">{order.items.length} items</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-gray-600 dark:text-gray-400 font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="text-lg font-black text-gray-900 dark:text-white">₹{order.total}</span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex justify-center">
                                                        <select
                                                            value={order.status || 'Pending'}
                                                            disabled={updatingId === order._id}
                                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-bold outline-none border-none cursor-pointer transition-all hover:scale-105 appearance-none text-center min-w-[130px] shadow-sm ${getStatusColor(order.status || 'Pending')} ${updatingId === order._id ? 'opacity-50 animate-pulse' : ''}`}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}

                    {activeTab === 'products' && (
                        // Products View
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Products List</h3>
                                <button
                                    onClick={() => {
                                        setEditingProduct(null);
                                        resetForm();
                                        setShowProductForm(true);
                                    }}
                                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                >
                                    <span className="material-symbols-rounded">add</span>
                                    Add New Product
                                </button>
                            </div>

                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-bold animate-pulse">Loading products...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(product => (
                                        <div key={product._id} className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col group hover:shadow-md transition-all">
                                            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 dark:bg-gray-800">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
                                                            {product.category}
                                                        </span>
                                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-2 leading-tight">{product.name}</h4>
                                                    </div>
                                                    <span className="text-lg font-black text-gray-900 dark:text-white">₹{product.basePrice}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{product.description}</p>
                                            </div>
                                            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <button
                                                    onClick={() => openEditForm(product)}
                                                    className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-sm transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="flex-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-sm transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
                                    <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-bold animate-pulse">Loading settings...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Manage Classes */}
                                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                            <span className="material-symbols-rounded text-primary-500">school</span>
                                            Manage Classes
                                        </h3>
                                        <form onSubmit={handleAddClass} className="flex gap-4 mb-6">
                                            <input
                                                type="text"
                                                value={newClass}
                                                onChange={(e) => setNewClass(e.target.value)}
                                                placeholder="Add new class (e.g. 11th)"
                                                className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newClass}
                                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all"
                                            >
                                                Add
                                            </button>
                                        </form>
                                        <div className="flex flex-wrap gap-2">
                                            {classes.map(cls => (
                                                <div key={cls} className="pl-3 pr-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2 group transition-colors">
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{cls}</span>
                                                    <div className="flex items-center border-l border-gray-300 dark:border-gray-700 pl-2 ml-1 gap-1">
                                                        <button onClick={() => handleRenameClass(cls)} className="p-0.5 rounded-full hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors" title="Rename">
                                                            <span className="material-symbols-rounded text-sm">edit</span>
                                                        </button>
                                                        <button onClick={() => handleRemoveClass(cls)} className="p-0.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors" title="Remove">
                                                            <span className="material-symbols-rounded text-sm">close</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Manage Divisions */}
                                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                            <span className="material-symbols-rounded text-secondary-500">grid_view</span>
                                            Manage Divisions
                                        </h3>
                                        <form onSubmit={handleAddDivision} className="flex gap-4 mb-6">
                                            <input
                                                type="text"
                                                value={newDivision}
                                                onChange={(e) => setNewDivision(e.target.value)}
                                                placeholder="Add new division (e.g. E)"
                                                className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newDivision}
                                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all"
                                            >
                                                Add
                                            </button>
                                        </form>
                                        <div className="flex flex-wrap gap-2">
                                            {divisions.map(div => (
                                                <div key={div} className="pl-3 pr-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2 group transition-colors">
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{div}</span>
                                                    <div className="flex items-center border-l border-gray-300 dark:border-gray-700 pl-2 ml-1 gap-1">
                                                        <button onClick={() => handleRenameDivision(div)} className="p-0.5 rounded-full hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors" title="Rename">
                                                            <span className="material-symbols-rounded text-sm">edit</span>
                                                        </button>
                                                        <button onClick={() => handleRemoveDivision(div)} className="p-0.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors" title="Remove">
                                                            <span className="material-symbols-rounded text-sm">close</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowProductForm(false)}></div>
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-6 sm:p-8 relative animate-zoom-in max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <form onSubmit={handleProductSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nutrition info (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.nutrition}
                                    onChange={(e) => setFormData({ ...formData, nutrition: e.target.value })}
                                    placeholder="e.g. 100 kcal, Sugar free"
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowProductForm(false)}
                                    className="flex-1 py-3 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

