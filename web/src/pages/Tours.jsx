import React from 'react';
import { Shield, Sparkles, Brain, ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tours = () => {
    const tours = [
        {
            id: 1,
            title: "Immunity Booster Tour",
            description: "Explore plants known to strengthen the immune system and fight infections.",
            plantsCount: 6,
            duration: "15 mins",
            icon: <Shield size={40} color="#556B2F" />,
            color: "#E8F5E9",
            image: "/images/tours/immunity-booster.jpg"
        },
        {
            id: 2,
            title: "Digestive Health Tour",
            description: "Discover herbs that aid digestion and maintain a healthy gut.",
            plantsCount: 5,
            duration: "12 mins",
            icon: <Sparkles size={40} color="#D35400" />,
            color: "#FFF3E0",
            image: "/images/tours/digestive-health.jpg"
        },
        {
            id: 3,
            title: "Stress Relief Tour",
            description: "Calming plants for mind and body relaxation.",
            plantsCount: 5,
            duration: "10 mins",
            icon: <Brain size={40} color="#6A4C93" />,
            color: "#F3E5F5",
            image: "/images/tours/stress-relief.jpg"
        }
    ];

    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Guided Thematic Tours</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
                    Take a curated journey through specific health themes. Learn about plants in a structured, interactive way.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '40px'
            }}>
                {tours.map(tour => (
                    <div key={tour.id} style={{
                        backgroundColor: 'var(--color-white)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-soft)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                            <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                <PlayCircle size={16} /> {tour.duration}
                            </div>
                        </div>

                        <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: tour.color,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {tour.icon}
                                </div>
                                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{tour.title}</h2>
                            </div>

                            <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>{tour.description}</p>

                            <div style={{
                                marginTop: 'auto',
                                paddingTop: '20px',
                                borderTop: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{tour.plantsCount} Plants</span>
                                <Link to={`/tours/${tour.id}`} className="btn btn-primary" style={{ padding: '10px 24px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                    Start Tour <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tours;
