import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, User, Bookmark, PlusCircle, ShoppingBag, Package } from 'lucide-react';
import CartIcon from './CartIcon';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Updated Navigation Links
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Explore Plants', path: '/explore' },
        { name: 'Tours', path: '/tours' },
        { name: 'My Bookmarks', path: '/bookmarks', icon: <Bookmark size={16} /> },
        { name: 'Buy Plants', path: '/buy-plants', icon: <ShoppingBag size={16} /> },
        { name: 'My Orders', path: '/orders', icon: <Package size={16} /> },
    ];

    return (
        <nav style={{
            backgroundColor: 'rgba(240, 234, 216, 0.95)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Leaf size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-primary)', lineHeight: '1' }}>VIRTUAL</span>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-text-light)', letterSpacing: '1px' }}>HERBAL GARDEN</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <ul style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="desktop-menu">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-dark)',
                                    fontWeight: location.pathname === link.path ? '700' : '500',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {/* Show a small icon next to bookmarks if defined */}
                                {link.icon && link.icon}
                                {link.name}
                            </Link>
                        </li>
                    ))}

                    {/* Vertical Divider */}
                    <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(0,0,0,0.1)' }}></div>

                    {/* Cart Icon */}
                    <li>
                        <CartIcon />
                    </li>

                    {/* Profile / Admin Link */}
                    <li>
                        <Link
                            to="/profile"
                            title="User & Admin Profile"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <div style={{
                                padding: '8px',
                                borderRadius: '50%',
                                backgroundColor: location.pathname === '/profile' ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
                                color: location.pathname === '/profile' ? 'white' : 'var(--color-text-dark)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}>
                                <User size={20} />
                            </div>
                        </Link>
                    </li>
                </ul>

                {/* Mobile Menu Toggle */}
                <div className="mobile-toggle" onClick={toggleMenu} style={{ display: 'none', cursor: 'pointer' }}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    left: 0,
                    width: '100%',
                    backgroundColor: 'var(--color-earthy-beige)',
                    padding: '20px',
                    boxShadow: 'var(--shadow-soft)',
                    zIndex: 999
                }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontSize: '1.1rem',
                                        color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-dark)',
                                    }}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <hr style={{ opacity: 0.1 }} />
                        <li>
                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '1.1rem',
                                    color: location.pathname === '/profile' ? 'var(--color-primary)' : 'var(--color-text-dark)',
                                }}
                            >
                                <User size={20} />
                                Profile / Admin
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* Responsive Styles Injection */}
            <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;