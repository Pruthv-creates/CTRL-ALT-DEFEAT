import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Loader, ShoppingBag, Calendar, MapPin, CreditCard } from 'lucide-react';

interface OrderItem {
    plantId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface Order {
    id: string;
    items: OrderItem[];
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    subtotal: number;
    shipping: number;
    tax: number;
    totalAmount: number;
    status: string;
    paymentId?: string;
    createdAt: any;
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate('/user-login');
                return;
            }

            try {
                const ordersQuery = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(ordersQuery);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Order));
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'shipped':
                return 'bg-blue-100 text-blue-700';
            case 'delivered':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0ead8] flex items-center justify-center">
                <Loader className="animate-spin text-[#1a4d2e]" size={48} />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#f0ead8] flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={64} className="text-gray-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">No orders yet</h2>
                    <p className="text-gray-500 mb-8">
                        You haven't placed any orders. Start shopping to see your orders here!
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

    return (
        <div className="min-h-screen bg-[#f0ead8] py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#1a4d2e] mb-2 flex items-center gap-3">
                        <Package size={36} />
                        My Orders
                    </h1>
                    <p className="text-gray-600">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm opacity-90 mb-1">Order ID</p>
                                        <p className="font-mono font-bold text-lg">{order.id}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm opacity-90 mb-1">Order Date</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <Calendar size={16} />
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <ShoppingBag size={18} />
                                    Items ({order.items.length})
                                </h3>
                                <div className="space-y-3 mb-6">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={item.imageUrl || 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#1a4d2e]">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Shipping Address */}
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <MapPin size={16} />
                                            Shipping Address
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {order.shippingAddress.fullName}<br />
                                            {order.shippingAddress.phone}<br />
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                            {order.shippingAddress.pincode}
                                        </p>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <CreditCard size={16} />
                                            Payment Summary
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal</span>
                                                <span>₹{order.subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Shipping</span>
                                                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Tax (GST)</span>
                                                <span>₹{order.tax.toFixed(2)}</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between font-bold text-[#1a4d2e]">
                                                <span>Total Paid</span>
                                                <span>₹{order.totalAmount.toFixed(2)}</span>
                                            </div>
                                            {order.paymentId && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Payment ID: {order.paymentId}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-8 text-center">
                    <Link
                        to="/buy-plants"
                        className="inline-flex items-center gap-2 text-[#1a4d2e] font-semibold hover:underline"
                    >
                        <ShoppingBag size={20} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Orders;
