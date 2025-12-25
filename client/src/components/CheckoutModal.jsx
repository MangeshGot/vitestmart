import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { CheckCircle2, CreditCard, QrCode, ArrowRight } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
    const { cart, subtotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);

    const [formData, setFormData] = useState({
        studentName: '',
        studentClass: '',
        studentDivision: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchSettings();
        }
    }, [isOpen]);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/settings');
            setClasses(data.classes);
            setDivisions(data.divisions);
            // Set defaults if available
            if (data.classes.length > 0) setFormData(prev => ({ ...prev, studentClass: data.classes[0] }));
            if (data.divisions.length > 0) setFormData(prev => ({ ...prev, studentDivision: data.divisions[0] }));
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Fallback defaults
            setClasses(['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']);
            setDivisions(['A', 'B', 'C', 'D']);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const orderData = {
                orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    qty: item.qty,
                    size: item.size,
                    image: item.image
                })),
                total: subtotal,
                student: formData.studentName,
                studentClass: formData.studentClass,
                studentDivision: formData.studentDivision
            };

            const user = JSON.parse(sessionStorage.getItem('user'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };

            const res = await axios.post('http://localhost:5001/api/orders', orderData, config);

            // Simulate payment delay
            setTimeout(() => {
                setIsProcessing(false);
                clearCart();
                onSuccess();
            }, 1500);
        } catch (error) {
            console.error('Error creating order:', error);
            setIsProcessing(false);
            alert('Checkout failed. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative animate-fade-in-up">

                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Secure Checkout</h2>
                        <p className="text-gray-500 text-sm mt-1">Complete your order details below</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-6 mb-8">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Student Name</label>
                            <input
                                required
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleInputChange}
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all font-medium"
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Class</label>
                                <select
                                    name="studentClass"
                                    value={formData.studentClass}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all font-medium appearance-none"
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Division</label>
                                <select
                                    name="studentDivision"
                                    value={formData.studentDivision}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all font-medium appearance-none"
                                >
                                    <option value="">Select Div</option>
                                    {divisions.map(div => (
                                        <option key={div} value={div}>{div}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="text-center animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                                <span className="material-symbols-rounded text-primary-600">qr_code_scanner</span>
                                Scan & Pay
                            </h3>
                            <div className="bg-white p-4 rounded-3xl inline-block mb-4 shadow-sm border border-gray-100">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=StudentMartOrder" alt="Payment QR" className="w-48 h-48 mx-auto mix-blend-multiply" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Scan with any UPI app to complete payment</p>
                        </div>
                    </div>

                    <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl mb-8 border border-primary-100 dark:border-primary-800/50 flex justify-between items-center">
                        <span className="font-bold text-primary-900 dark:text-primary-100 uppercase tracking-widest text-xs">Total Amount</span>
                        <span className="text-3xl font-black text-primary-600 dark:text-primary-400">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <div className="w-6 h-6 border-3 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Confirm Payment
                                <span className="material-symbols-rounded">verified_user</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
