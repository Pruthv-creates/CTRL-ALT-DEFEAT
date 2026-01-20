import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import {
    MapPin,
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
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [upiId, setUpiId] = useState('pruthvirajk2005@fam');
    const [showQR, setShowQR] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

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
        const params = new URLSearchParams({
            pa: upiId,
            pn: 'वनRealm',
            am: total.toFixed(2),
            cu: 'INR',
            tn: `Order Payment - ${orderId}`
        });

        return `upi://pay?${params.toString()}`;
    };

    const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPaymentProof(file);
            setProofPreview(URL.createObjectURL(file));
        }
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
                status: 'pending_payment',
                paymentMethod: 'UPI',
                createdAt: new Date()
            };

            const orderRef = await addDoc(collection(db, 'orders'), orderData);
            const generatedOrderId = orderRef.id;
            setOrderId(generatedOrderId);

            setShowQR(true);
            setLoading(false);

        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    const handleSubmitProof = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please login to continue');
            return;
        }

        if (!transactionId.trim()) {
            alert('Please enter the UPI transaction ID');
            return;
        }

        if (!paymentProof) {
            alert('Please upload payment proof screenshot');
            return;
        }

        setLoading(true);

        try {
            // Upload payment proof to Firebase Storage
            const { ref: storageRef, uploadBytes, getDownloadURL } = await import('firebase/storage');
            const { storage } = await import('../firebase');

            const proofRef = storageRef(storage, `payment-proofs/${orderId}_${Date.now()}.jpg`);
            await uploadBytes(proofRef, paymentProof);
            const proofUrl = await getDownloadURL(proofRef);

            // Update order with payment verification details
            await updateDoc(doc(db, 'orders', orderId), {
                status: 'payment_submitted',
                transactionId: transactionId,
                paymentProofUrl: proofUrl,
                paymentSubmittedAt: new Date()
            });

            // Update stock for each item
            for (const item of cart) {
                const plantRef = doc(db, 'plants', item.id);
                await updateDoc(plantRef, {
                    stock: increment(-item.quantity)
                });
            }

            clearCart();
            setOrderPlaced(true);
            setLoading(false);

        } catch (error) {
            console.error('Error submitting payment proof:', error);
            alert('Failed to submit payment proof. Please try again.');
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="success-page">
                <div className="success-card">
                    <div className="success-icon">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="checkout-title" style={{ fontSize: '28px', marginBottom: '16px' }}>Order Placed Successfully!</h1>
                    <p style={{ color: '#6b7280', marginBottom: '8px' }}>Thank you for your purchase</p>
                    <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '32px' }}>
                        Order ID: <span className="order-id">{orderId}</span>
                    </p>

                    <div className="action-buttons">
                        <button
                            onClick={() => navigate('/buy-plants')}
                            className="primary-btn"
                            style={{ marginTop: 0 }}
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="secondary-btn"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                {/* Header */}
                <div className="checkout-header">
                    <button
                        onClick={() => step === 1 ? navigate('/cart') : setStep(step - 1)}
                        className="back-btn"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1 className="checkout-title">Checkout</h1>
                </div>

                {/* Progress Steps */}
                <div className="steps-container">
                    <div className="steps-wrapper">
                        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-circle">
                                {step > 1 ? <CheckCircle size={20} /> : '1'}
                            </div>
                            <span className="step-label">Shipping</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-circle">2</div>
                            <span className="step-label">Payment</span>
                        </div>
                    </div>
                </div>

                <div className="checkout-grid">
                    {/* Main Content */}
                    <div className="checkout-main">
                        {step === 1 && (
                            <div className="card">
                                <h2 className="section-title">
                                    <MapPin size={24} />
                                    Shipping Address
                                </h2>
                                <div className="form-stack">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <User size={16} />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={shippingInfo.fullName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            <Phone size={16} />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingInfo.phone}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            <Home size={16} />
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={shippingInfo.city}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">State *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={shippingInfo.state}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={shippingInfo.pincode}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => validateStep1() && setStep(2)}
                                    disabled={!validateStep1()}
                                    className="primary-btn"
                                >
                                    Continue to Payment
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="card">
                                <h2 className="section-title">
                                    <Smartphone size={24} />
                                    UPI Payment
                                </h2>

                                <div className="order-review-section">
                                    <h3 className="sub-title">Order Items</h3>
                                    <div className="order-items-list">
                                        {cart.map(item => (
                                            <div key={item.id} className="order-item-row">
                                                <span>{item.commonName} x {item.quantity}</span>
                                                <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="shipping-review-section">
                                    <h3 className="sub-title">Shipping To:</h3>
                                    <div className="address-review">
                                        {shippingInfo.fullName}<br />
                                        {shippingInfo.phone}<br />
                                        {shippingInfo.address}<br />
                                        {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '24px' }}>
                                    <label className="form-label">Merchant UPI ID</label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="form-input"
                                        disabled={showQR}
                                    />
                                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                        Payments will be sent to this UPI ID
                                    </p>
                                </div>

                                {!showQR ? (
                                    <>
                                        <button
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="primary-btn"
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
                                        <p style={{ fontSize: '13px', textAlign: 'center', color: '#6b7280', marginTop: '16px' }}>
                                            Click to generate QR code for payment
                                        </p>
                                    </>
                                ) : (
                                    <div className="upi-section">
                                        <div className="qr-container">
                                            <QRCodeSVG
                                                value={generateUpiLink()}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a4d2e', marginBottom: '8px' }}>
                                            Scan to Pay ₹{total.toFixed(2)}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '24px' }}>
                                            Open any UPI app and scan this QR code to complete payment
                                        </p>

                                        {/* Payment Verification Form */}
                                        <div className="payment-verification-form">
                                            <h3 className="sub-title" style={{ marginTop: '32px' }}>Submit Payment Proof</h3>

                                            <div className="form-group">
                                                <label className="form-label">UPI Transaction ID *</label>
                                                <input
                                                    type="text"
                                                    value={transactionId}
                                                    onChange={(e) => setTransactionId(e.target.value)}
                                                    placeholder="e.g., 123456789012"
                                                    className="form-input"
                                                />
                                                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                                    Enter the 12-digit transaction ID from your UPI app
                                                </p>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Payment Screenshot *</label>
                                                <div className="proof-upload-container">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePaymentProofChange}
                                                        style={{ display: 'none' }}
                                                        id="proof-upload"
                                                    />
                                                    <label htmlFor="proof-upload" className="upload-label">
                                                        {proofPreview ? (
                                                            <div className="proof-preview">
                                                                <img src={proofPreview} alt="Payment proof" />
                                                                <p style={{ marginTop: '8px', fontSize: '13px', color: '#1a4d2e' }}>
                                                                    ✓ Screenshot uploaded - Click to change
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="upload-placeholder">
                                                                <Package size={32} />
                                                                <p style={{ marginTop: '8px', fontWeight: 600 }}>Upload Payment Screenshot</p>
                                                                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                                                    Click to select image (JPG, PNG)
                                                                </p>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleSubmitProof}
                                                disabled={loading || !transactionId.trim() || !paymentProof}
                                                className="primary-btn"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader className="animate-spin" size={20} />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={20} />
                                                        Submit Payment Proof
                                                    </>
                                                )}
                                            </button>
                                            <p style={{ fontSize: '12px', textAlign: 'center', color: '#9ca3af', marginTop: '12px' }}>
                                                Your order will be confirmed after admin verification
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="checkout-sidebar">
                        <div className="card summary-card">
                            <h2 className="section-title">Order Summary</h2>
                            <div className="summary-content">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="cart-info">
                                <Package size={14} />
                                {cart.length} item{cart.length > 1 ? 's' : ''} in cart
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
