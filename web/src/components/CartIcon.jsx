import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartIcon = () => {
    const { getCartCount } = useCart();
    const count = getCartCount();

    return (
        <Link to="/cart" className="relative">
            <div
                style={{
                    padding: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    color: 'var(--color-text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                }}
                className="cart-icon-container"
            >
                <ShoppingCart size={20} />
                {count > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            animation: 'cartBadgePulse 0.3s ease-out'
                        }}
                    >
                        {count > 99 ? '99+' : count}
                    </div>
                )}
            </div>
            <style>{`
                .cart-icon-container:hover {
                    background-color: var(--color-primary) !important;
                    color: white !important;
                }
                
                @keyframes cartBadgePulse {
                    0% { transform: scale(0.8); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </Link>
    );
};

export default CartIcon;
