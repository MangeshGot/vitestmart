import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle2 } from 'lucide-react';

const OrderHistoryModal = ({ isOpen, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchOrders = async () => {
                try {
                    const user = JSON.parse(sessionStorage.getItem('user'));
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    };
                    const res = await axios.get('http://localhost:5001/api/orders', config);
                    setOrders(res.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [isOpen]);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden relative flex flex-col animate-fade-in-up">

                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10 transition-colors">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="material-symbols-rounded text-primary-600">history</span>
                            Order History
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">View your previous shopping history</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <span className="material-symbols-rounded text-7xl mb-4 opacity-10">receipt_long</span>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">No orders yet</p>
                            <p className="text-sm">Start shopping to see your history here!</p>
                        </div>
                    ) : (
                        orders.map((order, idx) => (
                            <div key={order._id} className="bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 border-b border-gray-100 dark:border-gray-800">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">ID: {order.orderId}</span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pt-2">{order.student}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">₹{order.total.toFixed(2)}</span>
                                        <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${getStatusColor(order.status || 'Pending')}`}>
                                            <span className="material-symbols-rounded text-sm">
                                                {order.status === 'Delivered' ? 'check_circle' :
                                                    order.status === 'Cancelled' ? 'cancel' :
                                                        order.status === 'Shipped' ? 'local_shipping' :
                                                            'pending'}
                                            </span>
                                            {order.status || 'Pending'}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 bg-white/50 dark:bg-transparent">
                                    <div className="flex flex-wrap gap-4">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                <img src={item.image} className="w-12 h-12 object-contain blend-image" alt={item.name} />
                                                <div className="pr-4">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium">Qty: {item.qty} • {item.size || 'Base'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryModal;
