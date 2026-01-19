import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffect from '../components/BackgroundEffect';

// Mock Data
const TOURS_DATA = {
    1: {
        title: "Immunity Booster Tour",
        items: [
            { id: 'p1', year: 'Tulsi', title: 'The Queen of Herbs', description: "Holy Basil is renowned for its adaptogenic properties, helping the body stress and fighting infections.", image: "https://images.unsplash.com/photo-1615485925763-867862f8027a?w=800&q=80" },
            { id: 'p2', year: 'Echinacea', title: 'Purple Coneflower', description: "Widely used to boost the immune system and reduce symptoms of colds and flu.", image: "https://images.unsplash.com/photo-1600676449132-70b4a7873ad9?w=800&q=80" },
            { id: 'p3', year: 'Ginger', title: 'Spicy Healer', description: "A potent anti-inflammatory root that aids digestion and fights respiratory infections.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80" },
            { id: 'p4', year: 'Turmeric', title: 'Golden Spice', description: "Contains curcumin, a powerful antioxidant and anti-inflammatory compound.", image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80" },
            { id: 'p5', year: 'Amla', title: 'Indian Gooseberry', description: "Exceptionally rich in Vitamin C, it strengthens immunity and rejuvenates the body.", image: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=800&q=80" },
        ]
    },
    2: {
        title: "Digestive Health Tour",
        items: [
            { id: 'p1', year: 'Peppermint', title: 'Cooling Relief', description: "Relieves IBS symptoms and soothes stomach upsets.", image: "https://images.unsplash.com/photo-1600851167123-5d5f279168ce?w=800&q=80" },
            { id: 'p2', year: 'Fennel', title: 'Sweet Seed', description: "Traditionally used to reduce bloating and gas.", image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d71321?w=800&q=80" },
            { id: 'p3', year: 'Chamomile', title: 'Gentle Calmer', description: "Relaxes the digestive tract and eases acid reflux.", image: "https://images.unsplash.com/photo-1606923829579-0cb90f3d9dd6?w=800&q=80" },
        ]
    },
    3: {
        title: "Stress Relief Tour",
        items: [
            { id: 'p1', year: 'Lavender', title: 'Violet Calm', description: "Its scent is famous for reducing anxiety and promoting sleep.", image: "https://images.unsplash.com/photo-1588619461332-4458d33aaeb8?w=800&q=80" },
            { id: 'p2', year: 'Ashwagandha', title: 'Indian Ginseng', description: "A powerful adaptogen that lowers cortisol levels.", image: "https://images.unsplash.com/photo-1631551842944-e22119c86427?w=800&q=80" },
        ]
    }
};

const LeafIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" xmlns="http://www.w3.org/2000/svg">
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
    </svg>
);

const TourDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const tour = TOURS_DATA[id];
    const [activeIndex, setActiveIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!tour) return <div>Tour Not Found</div>;

    const events = tour.items;
    const CARD_WIDTH = 300;
    const currentEvent = events[activeIndex] || events[0];
    const xOffset = windowWidth / 2 - (activeIndex * CARD_WIDTH) - (CARD_WIDTH / 2);

    return (
        <div className="h-screen w-full bg-black overflow-hidden relative flex flex-col font-sans">

            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <BackgroundEffect />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            </div>

            {/* HEADER */}
            <div className="absolute top-0 left-0 w-full z-30 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => navigate('/tours')}
                    className="flex items-center gap-2 text-white hover:text-green-400 transition-colors"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                >
                    <ArrowLeft size={24} /> Back to Tours
                </button>
                <h1 className="text-2xl font-bold text-white tracking-widest uppercase">{tour.title}</h1>
            </div>

            {/* TOP SECTION: CONTENT (60%) */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-16 py-8 mt-10">
                <div className="max-w-7xl w-full flex flex-col md:flex-row gap-8 items-center h-full">

                    <AnimatePresence mode='wait'>
                        {/* LEFT: IMAGE BOX */}
                        <motion.div
                            key={`img-${currentEvent.id}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="w-full md:w-1/2 h-[40vh] md:h-[50vh] bg-white/5 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(74,222,128,0.2)] overflow-hidden relative group"
                        >
                            {currentEvent.image ? (
                                <img src={currentEvent.image} alt={currentEvent.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-600">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                        </motion.div>

                        {/* RIGHT: TEXT LINES */}
                        <motion.div
                            key={`txt-${currentEvent.id}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="w-full md:w-1/2 flex flex-col justify-center space-y-6"
                        >
                            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-600 tracking-tighter" style={{ WebkitBackgroundClip: 'text' }}>
                                {currentEvent.year}
                            </h2>
                            <div className="w-full h-[1px] bg-gradient-to-r from-green-500 to-transparent"></div>
                            <h3 className="text-2xl font-bold text-white tracking-widest uppercase">
                                {currentEvent.title}
                            </h3>
                            <div className="space-y-3">
                                <p className="text-gray-300 text-lg leading-relaxed font-light border-l-2 border-green-500 pl-4">
                                    {currentEvent.description}
                                </p>
                                <Link
                                    to={`/plant/${currentEvent.id}`} // Assuming this maps to a real ID
                                    className="inline-flex items-center gap-2 mt-4 text-green-400 hover:text-green-300 transition-colors"
                                    style={{ textDecoration: 'none' }}
                                >
                                    View Full Details <Leaf size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                </div>
            </div>

            {/* BOTTOM SECTION: CAROUSEL ROAD (40%) */}
            <div className="relative z-10 h-[350px] w-full overflow-hidden border-t border-white/5 bg-black/20 backdrop-blur-sm">

                {/* MOVING TRACK CONTAINER */}
                <motion.div
                    className="absolute top-0 h-full flex items-center"
                    animate={{ x: xOffset }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    style={{ left: 0, display: 'flex' }}
                >
                    {/* SVG PATH (THE GREEN ROAD) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                        <svg
                            width={events.length * CARD_WIDTH}
                            height="100%"
                            style={{ overflow: 'visible' }}
                        >
                            <motion.path
                                d={`M 0 175 ${events.map((_, i) => {
                                    const x = (i * CARD_WIDTH) + (CARD_WIDTH / 2);
                                    const y = i % 2 === 0 ? 100 : 250;
                                    return `L ${x} ${y}`;
                                }).join(' ')}`}
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="3"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2 }}
                            />
                        </svg>
                    </div>

                    {/* THE CAR/ICON ITSELF */}
                    <motion.div
                        className="absolute z-20 top-0 left-0"
                        animate={{
                            x: (activeIndex * CARD_WIDTH) + (CARD_WIDTH / 2) - 32,
                            y: (activeIndex % 2 === 0 ? 100 : 250) - 32,
                        }}
                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        style={{ width: '64px', height: '64px' }}
                    >
                        <LeafIcon />
                    </motion.div>

                    {/* RENDER CARDS */}
                    {events.map((event, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className="flex-shrink-0 relative group cursor-pointer flex flex-col items-center justify-center z-10"
                            style={{ width: CARD_WIDTH, height: '100%' }}
                        >
                            {/* Year Box */}
                            <div
                                className={`
                                    w-48 h-24 rounded-xl border flex items-center justify-center transition-all duration-300
                                    ${activeIndex === index
                                        ? 'bg-green-500/20 border-green-400 scale-110 shadow-[0_0_20px_rgba(74,222,128,0.4)]'
                                        : 'bg-black/40 border-white/10 hover:border-white/40 grayscale opacity-60'}
                                `}
                                style={{
                                    marginTop: index % 2 === 0 ? '120px' : '-120px',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <span className="text-xl font-bold font-mono text-white text-center px-2">
                                    {event.year}
                                </span>
                            </div>

                            {/* Dot on the road */}
                            <div
                                className={`absolute w-4 h-4 rounded-full border-2 border-black transition-colors duration-300 ${activeIndex === index ? 'bg-yellow-400' : 'bg-green-600'}`}
                                style={{
                                    top: index % 2 === 0 ? '100px' : '250px',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default TourDetail;
