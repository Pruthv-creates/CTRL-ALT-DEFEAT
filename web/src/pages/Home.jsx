import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Utensils, Wind, Smile, Activity, Search } from 'lucide-react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../firebase';
import PlantCard from '../components/PlantCard';

const Home = () => {
    const [featuredPlants, setFeaturedPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Health Categories Data
    const categories = [
        { name: 'Immune', icon: <Shield size={32} />, color: '#E8F5E9' },
        { name: 'Digestion', icon: <Utensils size={32} />, color: '#FFF3E0' },
        { name: 'Respiratory', icon: <Wind size={32} />, color: '#E3F2FD' },
        { name: 'Skin Care', icon: <Smile size={32} />, color: '#F3E5F5' },
        { name: 'Stress & Brain', icon: <Activity size={32} />, color: '#FFEBEE' },
    ];

    useEffect(() => {
        const fetchFeaturedPlants = async () => {
            try {
                const q = query(collection(db, "plants"), limit(4));
                const querySnapshot = await getDocs(q);
                const plantData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFeaturedPlants(plantData);
            } catch (error) {
                console.error("Error fetching featured plants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedPlants();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1544144433-d50aff500b91?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '60px'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ color: 'white', marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '4rem', fontWeight: '400' }}>वन</span>
                        <span style={{ fontSize: '3.5rem', fontWeight: '400' }}>Realm</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                        A forest of wisdom, alive in the digital realm. Explore medicinal plants used in AYUSH systems.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link to="/explore" className="btn btn-primary" style={{ backgroundColor: 'var(--color-primary)', border: 'none' }}>
                            Explore Plants
                        </Link>
                        <Link to="/tours" className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}>
                            Guided Tours
                        </Link>
                    </div>
                </div>
            </section>

            {/* Health Categories */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Health Categories</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '24px',
                    justifyContent: 'center'
                }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={`/explore?category=${encodeURIComponent(cat.name)}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '24px',
                                backgroundColor: 'var(--color-white)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-soft)',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                border: `1px solid ${cat.color}`
                            }}
                                className="category-card"
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    backgroundColor: cat.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '16px',
                                    color: 'var(--color-primary)'
                                }}>
                                    {cat.icon}
                                </div>
                                <span style={{ fontWeight: '600', color: 'var(--color-text-dark)', textAlign: 'center' }}>{cat.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
                <style>{`
          .category-card:hover {
            transform: translateY(-5px);
          }
        `}</style>
            </section>

            {/* Featured Medicinal Plants */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h2 className="section-title" style={{ margin: 0 }}>Featured Medicinal Plants</h2>
                    <Link to="/explore" style={{ color: 'var(--color-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        View All →
                    </Link>
                </div>

                {loading ? (
                    <p>Loading featured plants...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredPlants.length > 0 ? (
                            featuredPlants.map((plant) => (
                                <PlantCard key={plant.id} plant={plant} />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
                                <p>No featured plants found. Add some data to Firebase!</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
