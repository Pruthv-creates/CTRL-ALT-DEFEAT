import React, { useState } from 'react';
import { ShoppingBag, Package, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BuyPlants from './BuyPlants';
import Orders from './Orders';
import Cart from './Cart';

const Marketplace = () => {
    const [activeTab, setActiveTab] = useState<'buy' | 'orders' | 'cart'>('buy');
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    return (
        <div className="min-h-screen bg-[#f0ead8]">
            {/* Tabs Navigation */}
            <div className="container mx-auto px-4 pt-8 pb-4">
                <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2 max-w-2xl mx-auto">
                    <button
                        onClick={() => setActiveTab('buy')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${activeTab === 'buy'
                            ? 'bg-[#1a4d2e] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <ShoppingBag size={20} />
                        <span className="hidden sm:inline">Buy Plants</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${activeTab === 'orders'
                            ? 'bg-[#1a4d2e] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Package size={20} />
                        <span className="hidden sm:inline">My Orders</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('cart')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all relative ${activeTab === 'cart'
                            ? 'bg-[#1a4d2e] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <ShoppingCart size={20} />
                        <span className="hidden sm:inline">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'buy' && <BuyPlants />}
                {activeTab === 'orders' && <Orders />}
                {activeTab === 'cart' && <Cart />}
            </div>
        </div>
    );
};

export default Marketplace;
