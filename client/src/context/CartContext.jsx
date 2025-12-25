import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, size, price) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product._id && item.size === size);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product._id && item.size === size
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            return [...prevCart, {
                id: product._id,
                name: product.name,
                image: product.image,
                price: price,
                size: size,
                qty: 1
            }];
        });
    };

    const removeFromCart = (id, size) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === id && item.size === size)));
    };

    const updateQty = (id, size, qty) => {
        if (qty < 1) return removeFromCart(id, size);
        setCart(prevCart => prevCart.map(item =>
            (item.id === id && item.size === size) ? { ...item, qty } : item
        ));
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const cartCount = cart.reduce((count, item) => count + item.qty, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQty, clearCart, subtotal, cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
