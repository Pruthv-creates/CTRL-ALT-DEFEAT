import React, { useState, useEffect } from 'react';
import { Search, Filter, X, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PlantCard from '../components/PlantCard';

const ExplorePlants = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        healthCategory: [],
        ayushSystem: [],
        plantPartUsed: [],
        region: ''
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter Options
    const filterOptions = {
        healthCategory: ['Immunity', 'Digestion', 'Respiratory', 'Skin Care', 'Stress & Brain Health', 'Pain Relief'],
        ayushSystem: ['Ayurveda', 'Yoga', 'Unani', 'Siddha', 'Homeopathy'],
        plantPartUsed: ['Root', 'Leaf', 'Flower', 'Stem', 'Fruit', 'Seed', 'Whole Plant'],
        // regionalOrigin: ['India', 'Himalayas', 'Tropical', 'Arid'] // Example
    };

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "plants"));
                const plantData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPlants(plantData);
            } catch (error) {
                console.error("Error fetching plants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, []);

    const handleFilterChange = (category, value) => {
        setFilters(prev => {
            const newCategoryFilters = prev[category].includes(value)
                ? prev[category].filter(item => item !== value)
                : [...prev[category], value];
            return { ...prev, [category]: newCategoryFilters };
        });
    };


    const filteredPlants = plants.filter(plant => {
        // Search
        const searchMatch =
            plant.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.botanicalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.diseaseCategories?.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));

        // Health Category Filter (case-insensitive)
        const categoryMatch = filters.healthCategory.length === 0 ||
            (plant.diseaseCategories && plant.diseaseCategories.some(c =>
                filters.healthCategory.some(filter =>
                    c.toLowerCase().includes(filter.toLowerCase())
                )
            ));

        // AYUSH System Filter (case-insensitive)
        const systemMatch = filters.ayushSystem.length === 0 ||
            (plant.ayushSystems && plant.ayushSystems.some(s =>
                filters.ayushSystem.some(filter =>
                    s.toLowerCase().includes(filter.toLowerCase())
                )
            ));

        // Plant Part Used Filter (case-insensitive)
        // Check if plant has partsUsed, usedParts, or similar field
        const plantParts = plant.partsUsed || plant.usedParts || plant.plantPartsUsed || [];
        const partMatch = filters.plantPartUsed.length === 0 ||
            (plantParts.length > 0 && plantParts.some(p =>
                filters.plantPartUsed.some(filter =>
                    p.toLowerCase().includes(filter.toLowerCase())
                )
            ));

        return searchMatch && categoryMatch && systemMatch && partMatch;
    });

    return (
        <div className="container section">
            <div style={{ marginBottom: '40px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                    <input
                        type="text"
                        placeholder="Search by name, disease, or property..."
                        className="input-base"
                        style={{ paddingLeft: '48px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link
                    to="/add-plant"
                    className="btn btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <PlusCircle size={20} />
                    Contribute Plant
                </Link>
                <button
                    className="btn btn-outline mobile-only"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    style={{ display: 'none' }} // Hidden by default, shown in media query
                >
                    <Filter size={20} style={{ marginRight: '8px' }} /> Filters
                </button>
            </div>

            <div style={{ display: 'flex', gap: '40px' }}>
                {/* Filters Sidebar */}
                <aside style={{
                    width: '280px',
                    flexShrink: 0,
                    backgroundColor: '#F9F7F2',
                    padding: '24px',
                    borderRadius: 'var(--radius-md)',
                    height: 'fit-content',
                    display: showMobileFilters ? 'block' : 'block' // Logic for desktop/mobile hiding
                }} className="filters-sidebar">

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>Filters</h3>
                        {showMobileFilters && <X size={20} onClick={() => setShowMobileFilters(false)} />}
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--color-primary)' }}>Health Category</h4>
                        {filterOptions.healthCategory.map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                <input
                                    type="checkbox"
                                    checked={filters.healthCategory.includes(opt)}
                                    onChange={() => handleFilterChange('healthCategory', opt)}
                                    style={{ marginRight: '10px', accentColor: 'var(--color-primary)' }}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--color-primary)' }}>AYUSH System</h4>
                        {filterOptions.ayushSystem.map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                <input
                                    type="checkbox"
                                    checked={filters.ayushSystem.includes(opt)}
                                    onChange={() => handleFilterChange('ayushSystem', opt)}
                                    style={{ marginRight: '10px', accentColor: 'var(--color-primary)' }}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--color-primary)' }}>Plant Part Used</h4>
                        {filterOptions.plantPartUsed.map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                <input
                                    type="checkbox"
                                    checked={filters.plantPartUsed.includes(opt)}
                                    onChange={() => handleFilterChange('plantPartUsed', opt)}
                                    style={{ marginRight: '10px', accentColor: 'var(--color-primary)' }}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </aside>

                {/* Plant Grid */}
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '20px', color: 'var(--color-text-light)' }}>
                        Showing {filteredPlants.length} plants
                    </div>

                    {loading ? (
                        <p>Loading plants...</p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '24px'
                        }}>
                            {filteredPlants.length > 0 ? (
                                filteredPlants.map(plant => (
                                    <PlantCard key={plant.id} plant={plant} />
                                ))
                            ) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px' }}>
                                    <Leaf size={48} color="#ddd" style={{ marginBottom: '16px' }} />
                                    <p>No plants found matching your criteria.</p>
                                    <button
                                        className="btn btn-outline"
                                        style={{ marginTop: '16px' }}
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilters({ healthCategory: [], ayushSystem: [], plantPartUsed: [], region: '' });
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .filters-sidebar {
            display: none !important; 
            position: fixed;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100vh !important;
            z-index: 2000;
            overflow-y: auto;
          }
          .filters-sidebar[style*="display: block"] {
            display: block !important;
          }
          .mobile-only {
            display: flex !important;
          }
        }
      `}</style>
        </div>
    );
};

// Helper for empty state icon
const Leaf = ({ size, color, style }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
    >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
    </svg>
);

export default ExplorePlants;
