import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import {
    MapPin,
    CreditCard,
    CheckCircle,
    ArrowLeft,
    ArrowRight,
    Loader,
    Package,
    User,
    Phone,
    Home,
    Smartphone
} from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [upiId, setUpiId] = useState('pruthvirajk2005@fam'); // Your UPI ID
    const [showQR, setShowQR] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    // Redirect if cart is empty
    if (cart.length === 0 && !orderPlaced) {
        navigate('/cart');
        return null;
    }

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const validateStep1 = () => {
        const { fullName, phone, address, city, state, pincode } = shippingInfo;
        return fullName && phone && address && city && state && pincode;
    };

    const generateUpiLink = () => {
        // Generate UPI payment link
        const params = new URLSearchParams({
            pa: upiId, // Payee UPI ID
            pn: 'Virtual Herbal Garden', // Payee name
            am: total.toFixed(2), // Amount
            cu: 'INR', // Currency
            tn: `Order Payment - ${orderId}` // Transaction note
        });

        return `upi://pay?${params.toString()}`;
    };

    const handlePayment = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please login to complete the purchase');
            navigate('/user-login');
            return;
        }

        setLoading(true);

        try {
            // Create order in Firestore first
            const orderData = {
                userId: user.uid,
                items: cart.map(item => ({
                    plantId: item.id,
                    name: item.commonName,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl
                })),
                shippingAddress: shippingInfo,
                subtotal: subtotal,
                shipping: shipping,
                tax: tax,
                totalAmount: total,
                status: 'pending',
                paymentMethod: 'UPI',
                createdAt: new Date()
            };

            const orderRef = await addDoc(collection(db, 'orders'), orderData);
            const generatedOrderId = orderRef.id;
            setOrderId(generatedOrderId);

            // Show QR code
            setShowQR(true);
            setLoading(false);

            // Auto-confirm after 10 seconds (in production, use payment webhook)
            setTimeout(async () => {
                try {
                    // Update order status
                    await updateDoc(doc(db, 'orders', generatedOrderId), {
                        status: 'confirmed',
                        paymentId: `UPI_${Date.now()}`
                    });

                    // Update stock for each item
                    for (const item of cart) {
                        const plantRef = doc(db, 'plants', item.id);
                        await updateDoc(plantRef, {
                            stock: increment(-item.quantity)
                        });
                    }

                    // Clear cart
                    clearCart();
                    setOrderPlaced(true);
                } catch (error) {
                    console.error('Error updating order:', error);
                }
            }, 10000);

        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    // Order Success View
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-[#f0ead8] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1a4d2e] mb-4">Order Placed Successfully!</h1>
                    <p className="text-gray-600 mb-2">Thank you for your purchase</p>
                    <p className="text-sm text-gray-500 mb-8">Order ID: <span className="font-mono font-bold">{orderId}</span></p>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/buy-plants')}
                            className="w-full bg-[#1a4d2e] text-white py-3 rounded-xl hover:bg-[#143d23] transition-all font-bold"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full border-2 border-[#1a4d2e] text-[#1a4d2e] py-3 rounded-xl hover:bg-[#1a4d2e] hover:text-white transition-all font-bold"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0ead8] py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => step === 1 ? navigate('/cart') : setStep(step - 1)}
                        className="flex items-center gap-2 text-[#1a4d2e] hover:underline mb-4"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1 className="text-4xl font-bold text-[#1a4d2e]">Checkout</h1>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#1a4d2e]' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#1a4d2e] text-white' : 'bg-gray-200'}`}>
                                {step > 1 ? <CheckCircle size={20} /> : '1'}
                            </div>
                            <span className="font-semibold hidden sm:block">Shipping</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#1a4d2e]' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#1a4d2e] text-white' : 'bg-gray-200'}`}>
                                2
                            </div>
                            <span className="font-semibold hidden sm:block">Payment</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <div className="bg-white rounded-2xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-[#1a4d2e] mb-6 flex items-center gap-2">
                                    <MapPin size={24} />
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <User size={16} className="inline mr-1" />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={shippingInfo.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a4d2e] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Phone size={16} className="inline mr-1" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingInfo.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a4d2e] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Home size={16} className="inline mr-1" />
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a4d2e] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={shippingInfo.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a4d2e] focus:outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={shippingInfo.state}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a4d2e] focus:outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={shippingInfo.pincode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a4d2e] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => validateStep1() && setStep(2)}
                                    disabled={!validateStep1()}
                                    className="w-full mt-6 bg-[#1a4d2e] text-white py-4 rounded-xl hover:bg-[#143d23] transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue to Payment
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white rounded-2xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-[#1a4d2e] mb-6 flex items-center gap-2">
                                    <Smartphone size={24} />
                                    UPI Payment
                                </h2>

                                {/* Order Review */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-700 mb-4">Order Items</h3>
                                    <div className="space-y-3">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>{item.commonName} x {item.quantity}</span>
                                                <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address Review */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-bold text-gray-700 mb-2">Shipping To:</h3>
                                    <p className="text-sm text-gray-600">
                                        {shippingInfo.fullName}<br />
                                        {shippingInfo.phone}<br />
                                        {shippingInfo.address}<br />
                                        {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                                    </p>
                                </div>

                                {/* UPI ID Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Merchant UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="pruthvirajk2005@fam"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a4d2e] focus:outline-none transition-colors"
                                        disabled={showQR}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Payments will be sent to this UPI ID
                                    </p>
                                </div>

                                {!showQR ? (
                                    <>
                                        <button
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="w-full bg-[#1a4d2e] text-white py-4 rounded-xl hover:bg-[#143d23] transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader className="animate-spin" size={20} />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Smartphone size={20} />
                                                    Generate UPI QR Code
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-center text-gray-500 mt-4">
                                            Click to generate QR code for payment
                                        </p>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className="bg-white p-6 rounded-2xl border-2 border-[#1a4d2e] mb-4 inline-block">
                                            <QRCodeSVG
                                                value={generateUpiLink()}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <h3 className="font-bold text-lg text-[#1a4d2e] mb-2">Scan to Pay ₹{total.toFixed(2)}</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Open any UPI app and scan this QR code to complete payment
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                                            <Loader className="animate-spin" size={16} />
                                            <span>Waiting for payment confirmation...</span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Payment will auto-confirm in 10 seconds for demo
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
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
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-lg font-bold text-[#1a4d2e]">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 space-y-2">
                                <p className="flex items-center gap-2">
                                    <Package size={14} />
                                    {cart.length} item{cart.length > 1 ? 's' : ''} in cart
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
