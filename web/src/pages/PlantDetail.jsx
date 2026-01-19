import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Play, Volume2, Bookmark, Share2 } from 'lucide-react';
import BookmarkButton from '../components/BookmarkButton';

const PlantDetail = () => {
    const { id } = useParams();
    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchPlant = async () => {
            try {
                const docRef = doc(db, "plants", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPlant({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such plant!");
                }
            } catch (error) {
                console.error("Error fetching plant:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlant();
    }, [id]);

    if (loading) return <div className="container section">Loading...</div>;
    if (!plant) return <div className="container section">Plant not found <Link to="/explore">Go back</Link></div>;

    return (
        <div className="container section">
            <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-text-light)' }}>
                <ArrowLeft size={20} /> Back to Plants
            </Link>

            <div className="plant-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
                {/* Left: Interactive Plant Explorer (Image Placeholder) */}
                <div style={{ backgroundColor: '#F5F5F5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', minHeight: '400px' }}>
                    {plant.media?.images?.[0] ? (
                        <img
                            src={plant.media.images[0]}
                            alt={plant.commonName}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            No 3D Model/Image Available
                        </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '10px' }}>
                        <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>Zoom & Rotate</button>
                        <button className="btn" style={{ backgroundColor: 'white', fontSize: '0.9rem', padding: '8px 16px' }}>2D/3D Toggle</button>
                    </div>
                </div>

                {/* Right: Basic Info */}
                <div>
                    <h1 style={{ marginBottom: '10px' }}>{plant.commonName}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', fontStyle: 'italic', marginBottom: '20px' }}>
                        {plant.botanicalName}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                        {plant.categoryTag && <span style={{ padding: '6px 16px', borderRadius: '20px', backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)', fontWeight: '600' }}>{plant.categoryTag}</span>}
                        {plant.ayushSystems?.slice(0, 2).map((sys, idx) => (
                            <span key={idx} style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #ddd', color: 'var(--color-text-medium)' }}>{sys}</span>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                        <BookmarkButton plantId={plant.id} />
                        <button className="btn btn-outline" style={{ gap: '8px' }}>
                            <Share2 size={18} /> Share
                        </button>
                    </div>

                    <div style={{ padding: '20px', backgroundColor: '#FFFDF5', border: '1px solid #EFEDDF', borderRadius: '12px' }}>
                        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Volume2 size={20} color="var(--color-primary)" /> Audio Explanation
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Listen to the traditional uses and pronunciation.</p>
                        <div style={{ marginTop: '10px', height: '40px', backgroundColor: '#e0e0e0', borderRadius: '20px', display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                            <Play size={16} fill="black" />
                            <div style={{ flex: 1, height: '4px', backgroundColor: '#ccc', marginLeft: '10px', borderRadius: '2px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs / Detailed Info */}
            <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: '40px', boxShadow: 'var(--shadow-soft)' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
                    {['Description', 'AYUSH Usage', 'Medicinal Properties', 'Precautions', 'Life Cycle'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                            style={{
                                padding: '15px 30px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: activeTab === tab.toLowerCase().split(' ')[0] ? 'var(--color-primary)' : '#888',
                                borderBottom: activeTab === tab.toLowerCase().split(' ')[0] ? '3px solid var(--color-primary)' : '3px solid transparent',
                                marginBottom: '-1px'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ minHeight: '200px' }}>
                    {activeTab === 'description' && (
                        <div>
                            <h3 style={{ marginBottom: '20px' }}>Plant Description</h3>
                            <p>{plant.description || "No description available."}</p>
                        </div>
                    )}

                    {activeTab === 'ayush' && (
                        <div>
                            <h3 style={{ marginBottom: '20px' }}>AYUSH Usage</h3>
                            <p>{plant.ayushUsage || `Used in ${plant.ayushSystems?.join(', ')} systems.`}</p>
                        </div>
                    )}

                    {activeTab === 'medicinal' && (
                        <div>
                            <h3 style={{ marginBottom: '20px' }}>Medicinal Properties & Therapeutic Uses</h3>
                            <ul>
                                {plant.medicinalProperties?.map((prop, idx) => (
                                    <li key={idx} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
                                        {prop}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'precautions' && (
                        <div>
                            <h3 style={{ marginBottom: '20px' }}>Safety & Precautions</h3>
                            <p>Always consult a certified practitioner before using any herbal remedies, especially if pregnant or nursing.</p>
                        </div>
                    )}

                    {activeTab === 'life' && (
                        <div>
                            <h3 style={{ marginBottom: '20px' }}>Life Cycle & Harvesting</h3>
                            <p>Information about the seasonal behavior and best time for harvesting.</p>
                        </div>
                    )}

                </div>
            </div>

            {/* Responsive styles */}
            <style>{`
        @media (max-width: 768px) {
          .plant-header {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default PlantDetail;
