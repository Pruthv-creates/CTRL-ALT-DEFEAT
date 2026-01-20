import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ArrowLeft, Play, Volume2, Bookmark, Share2 } from 'lucide-react';
import BookmarkButton from '../components/BookmarkButton';
import PlantModel3D from '../components/PlantModel3D';

const PlantDetail = () => {
    const { id } = useParams();
    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [is3DMode, setIs3DMode] = useState(false);

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

    // Track plant visit
    useEffect(() => {
        const trackVisit = async () => {
            const user = auth.currentUser;
            if (!user || !plant) return;

            try {
                const userRef = doc(db, "Users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const visitHistory = userDoc.data()?.visitHistory || [];

                    // Remove existing visit of this plant (to update timestamp)
                    const filteredHistory = visitHistory.filter((visit) => visit.plantId !== id);

                    // Create new visit entry
                    const newVisit = {
                        plantId: id,
                        visitedAt: new Date(),
                        plantName: plant.commonName || 'Unknown Plant',
                        plantImage: plant.media?.images?.[0] || ''
                    };

                    // Keep only last 50 visits
                    const updatedHistory = [newVisit, ...filteredHistory].slice(0, 50);

                    // Update Firestore
                    await updateDoc(userRef, {
                        visitHistory: updatedHistory
                    });
                }
            } catch (error) {
                console.error("Error tracking visit:", error);
            }
        };

        trackVisit();
    }, [plant, id]);

    if (loading) return <div className="container section">Loading...</div>;
    if (!plant) return <div className="container section">Plant not found <Link to="/explore">Go back</Link></div>;

    return (
        <div className="container section">
            <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-text-light)' }}>
                <ArrowLeft size={20} /> Back to Plants
            </Link>

            <div className="plant-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
                {/* Left: Interactive Plant Explorer (2D/3D Toggle) */}
                <div style={{ backgroundColor: '#F5F5F5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', minHeight: '400px' }}>
                    {is3DMode ? (
                        // 3D Model View
                        (() => {
                            // Map plant common names to 3D model filenames
                            const modelMap = {
                                'aloe vera': 'aloe',
                                'amla': 'amla',
                                'ashwagandha': 'ashwagandha',
                                'neem': 'neem',
                                'turmeric': 'turmeric',
                                'tulsi': 'tulsi',
                                'ginger': 'ginger',
                                'mint': 'mint',
                                'rose': 'rose',
                                'lemon': 'lemon',
                                'licorice': 'licorice',
                                'calendula': 'calendula',
                                'giloy': 'giloy',
                                'guduchi': 'giloy'
                            };

                            const plantNameLower = plant.commonName?.toLowerCase() || '';
                            const modelName = modelMap[plantNameLower];
                            const modelPath = modelName ? `/assets/3dModels/${modelName}.glb` : null;

                            return modelPath ? (
                                <PlantModel3D modelPath={modelPath} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
                                    <p style={{ color: '#666' }}>3D Model not available for this plant</p>
                                    <button
                                        onClick={() => setIs3DMode(false)}
                                        className="btn btn-outline"
                                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                                    >
                                        View 2D Images
                                    </button>
                                </div>
                            );
                        })()
                    ) : (
                        // 2D Image View
                        (() => {
                            // Try to get image from Firestore first, then fallback to assets
                            let imageUrl = plant.media?.images?.[0];

                            // If no Firestore image, map to local assets
                            if (!imageUrl) {
                                const imageMap = {
                                    'aloe vera': 'aloe1',
                                    'amla': 'amla1',
                                    'ashwagandha': 'ashwagandha1',
                                    'neem': 'neem1',
                                    'turmeric': 'turmeric1',
                                    'tulsi': 'tulsi1',
                                    'ginger': 'ginger1',
                                    'mint': 'mint1',
                                    'rose': 'rose1',
                                    'lemon': 'lemon1',
                                    'licorice': 'licorice1',
                                    'calendula': 'calendula1',
                                    'brahmi': 'brahmi1',
                                    'guduchi': 'guduchi1',
                                    'giloy': 'guduchi1',
                                    'shatavari': 'shatavari1',
                                    'bhringraj': 'bhringraj1',
                                    'haritaki': 'haritaki1',
                                    'arnica': 'arnica1',
                                    'fennel': 'fennel1',
                                    'cucumber': 'cucumber1',
                                    'adhatoda': 'adhatoda1',
                                    'bala': 'bala1',
                                    'guggul': 'guggul1',
                                    'jatamansi': 'jatamansi1',
                                    'kutki': 'kutki1',
                                    'manjistha': 'manjistha1',
                                    'nilavembu': 'nilavembu1',
                                    'nux vomica': 'nuxvomica1',
                                    'pippali': 'pippali1',
                                    'punarnava': 'punarnava1',
                                    'senna': 'senna1',
                                    'shankhpushpi': 'shankhpushpi1',
                                    'thuthuvalai': 'thuthuvalai1',
                                    'vacha': 'vacha1',
                                    'vidanga': 'vidanga1'
                                };

                                const plantNameLower = plant.commonName?.toLowerCase() || '';
                                const imageName = imageMap[plantNameLower];

                                if (imageName) {
                                    imageUrl = `../../assets/images/${imageName}.jpg`;
                                }
                            }

                            return imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={plant.commonName}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }}
                                    onError={(e) => {
                                        // If .jpg fails, try .jpeg
                                        if (e.target.src.endsWith('.jpg')) {
                                            e.target.src = e.target.src.replace('.jpg', '.jpeg');
                                        }
                                    }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    No Image Available
                                </div>
                            );
                        })()
                    )}
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setIs3DMode(!is3DMode)}
                            className="btn"
                            style={{
                                backgroundColor: is3DMode ? 'var(--color-primary)' : 'white',
                                color: is3DMode ? 'white' : 'var(--color-text-dark)',
                                fontSize: '0.9rem',
                                padding: '8px 16px',
                                fontWeight: '600'
                            }}
                        >
                            {is3DMode ? '2D View' : '3D View'}
                        </button>
                        {is3DMode && (
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                color: '#666'
                            }}>
                                Drag to rotate • Scroll to zoom
                            </div>
                        )}
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
