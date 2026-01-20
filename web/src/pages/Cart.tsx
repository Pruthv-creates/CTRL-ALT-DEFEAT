import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#f0ead8] flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={64} className="text-gray-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">
                        Looks like you haven't added any plants to your cart yet.
                    </p>
                    <Link
                        to="/buy-plants"
                        className="inline-flex items-center gap-2 bg-[#1a4d2e] text-white px-8 py-4 rounded-xl hover:bg-[#143d23] transition-all shadow-lg hover:shadow-xl font-bold"
                    >
                        <ShoppingBag size={20} />
                        Browse Plants
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen bg-[#f0ead8] py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#1a4d2e] mb-2 flex items-center gap-3">
                        <ShoppingBag size={36} />
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex gap-6">
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={item.imageUrl || 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop'}
                                            alt={item.commonName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-[#1a4d2e] mb-1">{item.commonName}</h3>
                                        {item.botanicalName && (
                                            <p className="text-sm text-gray-400 italic mb-3">{item.botanicalName}</p>
                                        )}

                                        <div className="flex items-center justify-between">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                                <span className="text-xs text-gray-400 ml-2">
                                                    ({item.stock} available)
                                                </span>
                                            </div>

                                            {/* Price & Remove */}
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl font-bold text-[#1a4d2e]">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove from cart"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart */}
                        <button
                            onClick={clearCart}
                            className="text-red-500 hover:text-red-600 font-semibold text-sm flex items-center gap-2 mt-4"
                        >
                            <Trash2 size={16} />
                            Clear entire cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
                            <h2 className="text-xl font-bold text-[#1a4d2e] mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                                {shipping === 0 && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <Package size={12} />
                                        Free shipping on orders over ₹500
                                    </p>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-lg font-bold text-[#1a4d2e]">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full bg-[#1a4d2e] text-white py-4 rounded-xl hover:bg-[#143d23] transition-all shadow-lg hover:shadow-xl font-bold flex items-center justify-center gap-2 group"
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/buy-plants"
                                className="block text-center text-[#1a4d2e] font-semibold mt-4 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
