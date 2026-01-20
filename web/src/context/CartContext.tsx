import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface CartItem {
    id: string;
    commonName: string;
    botanicalName?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('herbal_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('herbal_cart', JSON.stringify(cart));

        // Also sync to Firestore if user is logged in
        const syncToFirestore = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    await setDoc(doc(db, 'carts', user.uid), {
                        items: cart,
                        updatedAt: new Date()
                    });
                } catch (error) {
                    console.error('Error syncing cart to Firestore:', error);
                }
            }
        };

        syncToFirestore();
    }, [cart]);

    // Load cart from Firestore when user logs in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const cartDoc = await getDoc(doc(db, 'carts', user.uid));
                    if (cartDoc.exists()) {
                        const firestoreCart = cartDoc.data().items || [];
                        // Merge with local cart (prefer Firestore)
                        setCart(firestoreCart);
                    }
                } catch (error) {
                    console.error('Error loading cart from Firestore:', error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);

            if (existingItem) {
                // Increase quantity if item already in cart
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, item.stock) }
                        : cartItem
                );
            } else {
                // Add new item with quantity 1
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId
                    ? { ...item, quantity: Math.min(quantity, item.stock) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const value: CartContextType = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
