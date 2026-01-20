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
            {
                id: 'p1',
                year: 'Tulsi',
                title: 'The Queen of Herbs',
                shortDescription: "Revered as the 'Queen of Herbs', Tulsi helps the body adapt to stress and fights infections.",
                description: "Holy Basil (Ocimum sanctum) is revered in Ayurvedic medicine as the 'Queen of Herbs' for its remarkable adaptogenic properties. This sacred plant helps the body adapt to stress while powerfully fighting bacterial, viral, and fungal infections. Rich in antioxidants and essential oils, Tulsi strengthens the immune system, reduces inflammation, and protects against environmental toxins. Traditional uses include treating respiratory disorders, fever, and digestive issues. Regular consumption as tea or fresh leaves can enhance overall vitality and resilience.",
                image: "/assets/images/tulsi1.jpg"
            },
            {
                id: 'p2',
                year: 'Echinacea',
                title: 'Purple Coneflower',
                shortDescription: "A powerful immune-booster that stimulates defense mechanisms to reduce cold and flu symptoms.",
                description: "Echinacea purpurea, commonly known as Purple Coneflower, is one of the most extensively researched immune-boosting herbs in Western herbalism. Native to North America, this beautiful flowering plant contains active compounds that stimulate white blood cell production and enhance the body's natural defense mechanisms. Clinical studies show it can reduce the duration and severity of colds and flu by up to 50%. The roots and aerial parts are used to create tinctures, teas, and supplements that support respiratory health and prevent recurrent infections.",
                image: "/assets/images/echinacea1.jpg"
            },
            {
                id: 'p3',
                year: 'Ginger',
                title: 'Spicy Healer',
                shortDescription: "A potent anti-inflammatory root that aids digestion, fights respiratory infections, and warms the body.",
                description: "Ginger (Zingiber officinale) is a potent medicinal root celebrated for over 5,000 years in traditional Chinese and Ayurvedic medicine. Its active compound, gingerol, provides powerful anti-inflammatory and antioxidant effects that combat infections and boost immunity. Ginger excels at fighting respiratory infections, reducing nausea, improving circulation, and warming the body during cold seasons. Fresh ginger tea with honey is a time-tested remedy for sore throats and congestion. It also enhances nutrient absorption and supports digestive health, making it a comprehensive wellness ally.",
                image: "/assets/images/ginger1.jpg"
            },
            {
                id: 'p4',
                year: 'Turmeric',
                title: 'Golden Spice',
                shortDescription: "Golden spice with powerful anti-inflammatory and antioxidant properties for immune support.",
                description: "Turmeric (Curcuma longa) contains curcumin, one of nature's most powerful anti-inflammatory and antioxidant compounds. This golden spice has been used in Indian medicine for over 4,000 years to treat infections, wounds, and inflammatory conditions. Curcumin modulates the immune system, enhances antibody responses, and protects cells from oxidative damage. When combined with black pepper (which increases absorption by 2000%), turmeric becomes a potent immune booster. It supports liver detoxification, reduces chronic inflammation, and may help prevent various diseases.",
                image: "/assets/images/turmeric1.jpg"
            },
            {
                id: 'p5',
                year: 'Amla',
                title: 'Indian Gooseberry',
                shortDescription: "Rich in Vitamin C, this superfruit strengthens immunity and rejuvenates the body.",
                description: "Amla (Phyllanthus emblica), also known as Indian Gooseberry, is one of the richest natural sources of Vitamin C, containing 20 times more than oranges. This superfruit is a cornerstone of Ayurvedic medicine, prized for its rejuvenating and immune-strengthening properties. Amla's unique heat-stable Vitamin C remains potent even after cooking. It enhances white blood cell function, neutralizes free radicals, and supports the production of antibodies. Regular consumption improves skin health, hair growth, digestion, and overall vitality. Traditionally used in Chyawanprash, a revered Ayurvedic tonic.",
                image: "/assets/images/amla1.jpg"
            },
            {
                id: 'p6',
                year: 'Neem',
                title: 'Nature\'s Pharmacy',
                shortDescription: "Known as 'Nature's Pharmacy', it detoxifies the body and fights various infections.",
                description: "Neem (Azadirachta indica) is known as 'the village pharmacy' in India due to its extensive medicinal properties. Every part of the neem tree—leaves, bark, seeds, and oil—possesses powerful antibacterial, antiviral, antifungal, and antiparasitic properties. Neem purifies the blood, detoxifies the body, and strengthens immune function. It's particularly effective against skin infections, dental problems, and parasitic diseases. Rich in antioxidants and anti-inflammatory compounds, neem supports overall health and has been used in Ayurvedic medicine for thousands of years.",
                image: "/assets/images/neem1.jpg"
            },
        ]
    },
    2: {
        title: "Digestive Health Tour",
        items: [
            {
                id: 'p1',
                year: 'Peppermint',
                title: 'Cooling Relief',
                shortDescription: "Provides cooling relief for digestion, soothing bloating and IBS symptoms.",
                description: "Peppermint (Mentha piperita) is a powerful digestive aid with a refreshing, cooling effect. Its active compound, menthol, relaxes the smooth muscles of the digestive tract, providing relief from irritable bowel syndrome (IBS), bloating, and indigestion. Clinical studies show peppermint oil capsules can reduce IBS symptoms by up to 50%. The herb also stimulates bile flow, which aids fat digestion, and has antimicrobial properties that combat harmful gut bacteria. Peppermint tea after meals promotes healthy digestion and freshens breath naturally.",
                image: "/assets/images/peppermint1.jpg"
            },
            {
                id: 'p2',
                year: 'Fennel',
                title: 'Sweet Seed',
                shortDescription: "Reduces bloating and gas while stimulating heathy digestion.",
                description: "Fennel (Foeniculum vulgare) has been used for over 2,000 years as a digestive remedy in Mediterranean and Indian cultures. The seeds contain anethole, a compound that reduces gas, bloating, and stomach cramps by relaxing intestinal muscles. Fennel stimulates digestive enzyme production, improves nutrient absorption, and has mild laxative properties that relieve constipation. It's particularly beneficial for nursing mothers as it increases milk production. Chewing fennel seeds after meals is a traditional practice that aids digestion and prevents bad breath.",
                image: "/assets/images/fennel1.jpg"
            },
            {
                id: 'p3',
                year: 'Chamomile',
                title: 'Gentle Calmer',
                shortDescription: "Gentle herb that soothes the digestive tract and calms the mind.",
                description: "Chamomile (Matricaria chamomilla) is a gentle yet effective herb for soothing the entire digestive system. Its anti-inflammatory and antispasmodic properties relax the digestive tract, reducing symptoms of acid reflux, gastritis, and ulcers. Chamomile contains compounds that protect the stomach lining and promote healing of inflamed tissues. It's particularly helpful for stress-related digestive issues, as it calms both the mind and gut. A warm cup of chamomile tea before bed aids digestion, reduces bloating, and promotes restful sleep.",
                image: "/assets/images/chamomile1.jpg"
            },
            {
                id: 'p4',
                year: 'Triphala',
                title: 'Three Fruit Formula',
                shortDescription: "A revered three-fruit formula that gently cleanses and detoxifies the digestive system.",
                description: "Triphala is a revered Ayurvedic formula combining three fruits: Amalaki (Amla), Bibhitaki, and Haritaki. This powerful blend gently cleanses and detoxifies the digestive system while nourishing and rejuvenating tissues. Triphala regulates bowel movements, improves nutrient absorption, reduces inflammation, and supports healthy gut bacteria. Unlike harsh laxatives, it's non-habit forming and safe for long-term use. It also acts as a powerful antioxidant, supporting liver function and overall vitality. Traditionally taken before bed for optimal digestive health.",
                image: "/assets/images/triphala1.jpg"
            },
            {
                id: 'p5',
                year: 'Licorice Root',
                title: 'Sweet Soother',
                shortDescription: "Soothes and protects the stomach lining, helping to heal ulcers and acidity.",
                description: "Licorice root (Glycyrrhiza glabra) is a sweet, soothing herb that protects and heals the digestive tract. It contains glycyrrhizin and flavonoids that reduce inflammation, heal ulcers, and protect the stomach lining from acid damage. Licorice stimulates mucus production in the digestive tract, creating a protective barrier against irritants. It's particularly effective for treating heartburn, GERD, and peptic ulcers. The root also has mild laxative properties and supports liver detoxification. Note: Use deglycyrrhizinated (DGL) licorice for long-term use to avoid potential side effects.",
                image: "/assets/images/licorice1.jpg"
            },
        ]
    },
    3: {
        title: "Stress Relief Tour",
        items: [
            {
                id: 'p1',
                year: 'Lavender',
                title: 'Violet Calm',
                shortDescription: "Renowned for its ability to reduce anxiety and promote restful, deep sleep.",
                description: "Lavender (Lavandula angustifolia) is renowned worldwide for its calming and anxiety-reducing properties. The aromatic compounds in lavender, particularly linalool and linalyl acetate, interact with neurotransmitters in the brain to reduce stress hormones and promote relaxation. Clinical studies show lavender aromatherapy can reduce anxiety levels by up to 45% and significantly improve sleep quality. It's effective for treating insomnia, nervous tension, headaches, and mild depression. Lavender tea, essential oil, or dried flowers in sachets provide gentle, natural stress relief without sedative side effects.",
                image: "/assets/images/lavender1.jpg"
            },
            {
                id: 'p2',
                year: 'Ashwagandha',
                title: 'Indian Ginseng',
                shortDescription: "A powerful adaptogen that lowers cortisol levels and builds stress resilience.",
                description: "Ashwagandha (Withania somnifera) is one of the most powerful adaptogenic herbs in Ayurvedic medicine, used for over 3,000 years to combat stress and restore balance. It significantly reduces cortisol levels (the stress hormone) by up to 30%, helping the body adapt to physical and mental stressors. Ashwagandha improves energy, focus, and resilience while reducing anxiety and depression symptoms. It also enhances sleep quality, supports thyroid function, and boosts cognitive performance. The root is traditionally consumed as a powder mixed with warm milk and honey before bed.",
                image: "/assets/images/ashwagandha1.jpg"
            },
            {
                id: 'p3',
                year: 'Brahmi',
                title: 'Memory Enhancer',
                shortDescription: "Enhances cognitive function, memory, and mental clarity while reducing stress.",
                description: "Brahmi (Bacopa monnieri) is a revered Ayurvedic herb known for enhancing cognitive function and reducing mental stress. It contains bacosides, compounds that protect brain cells from oxidative stress and improve neurotransmitter function. Brahmi enhances memory, learning capacity, and mental clarity while reducing anxiety and mental fatigue. Studies show it can improve information processing speed and reduce anxiety symptoms within 12 weeks. It's particularly beneficial for students and professionals facing mental stress. Traditionally consumed as a tea or powder mixed with ghee.",
                image: "/assets/images/brahmi1.jpg"
            },
            {
                id: 'p4',
                year: 'Passionflower',
                title: 'Tranquil Blossom',
                shortDescription: "Calms nervous restlessness and promotes relaxation for better sleep.",
                description: "Passionflower (Passiflora incarnata) is a beautiful climbing vine with powerful calming properties. It increases levels of GABA (gamma-aminobutyric acid) in the brain, a neurotransmitter that reduces brain activity and promotes relaxation. Passionflower is particularly effective for treating anxiety, insomnia, and nervous restlessness without causing drowsiness or dependency. It's often combined with other calming herbs like valerian and lemon balm for enhanced effects. The aerial parts are used to make teas and tinctures that promote peaceful sleep and emotional balance.",
                image: "/assets/images/passionflower1.jpg"
            },
            {
                id: 'p5',
                year: 'Lemon Balm',
                title: 'Cheerful Herb',
                shortDescription: "Uplifting citrus herb that reduces nervous tension and promotes a positive mood.",
                description: "Lemon Balm (Melissa officinalis) is a gentle, uplifting herb from the mint family with a delightful lemony scent. It has been used since the Middle Ages to reduce stress, anxiety, and nervous tension while promoting a positive mood. Lemon balm contains rosmarinic acid and other compounds that calm the nervous system, improve cognitive function, and support healthy sleep patterns. It's particularly effective for stress-related digestive issues and tension headaches. The fresh or dried leaves make a delicious, calming tea that can be enjoyed throughout the day.",
                image: "/assets/images/lemonbalm1.jpg"
            },
        ]
    }
};

// Helper function to convert plant names to Firestore IDs
const getPlantId = (plantName) => {
    // Map of plant names from tours to their Firestore document IDs
    const nameToIdMap = {
        // Immunity Booster Tour
        'tulsi': 'tulsi',
        'echinacea': 'echinacea',
        'ginger': 'ginger',
        'turmeric': 'turmeric',
        'amla': 'amla',
        'neem': 'neem',

        // Digestive Health Tour
        'peppermint': 'peppermint',
        'fennel': 'fennel',
        'chamomile': 'chamomile',
        'triphala': 'triphala',
        'licorice root': 'licorice',

        // Stress Relief Tour
        'lavender': 'lavender',
        'ashwagandha': 'ashwagandha',
        'brahmi': 'brahmi',
        'passionflower': 'passionflower',
        'lemon balm': 'lemon_balm',
    };

    const lowerName = plantName.toLowerCase();

    // Check if there's a special mapping
    if (nameToIdMap[lowerName]) {
        return nameToIdMap[lowerName];
    }

    // Default: replace spaces with underscores
    return lowerName.replace(/\s+/g, '_');
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
                                    {currentEvent.shortDescription}
                                </p>
                                <Link
                                    to={`/plant/${getPlantId(currentEvent.year)}`}
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
