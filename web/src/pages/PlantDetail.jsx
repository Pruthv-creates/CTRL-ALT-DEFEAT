import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ArrowLeft, Play, Volume2, Bookmark, Share2 } from 'lucide-react';
import BookmarkButton from '../components/BookmarkButton';
import PlantModel3D from '../components/PlantModel3D';
import ImageSlideshow from '../components/ImageSlideshow';
import AudioPlayer from '../components/AudioPlayer';

// Plant descriptions map
const plantDescriptions = {
  ginger: "Ginger is a versatile rhizome known for its warming properties and digestive benefits. Widely used in traditional medicine systems, it helps combat nausea, reduce inflammation, and improve digestion. The active compounds gingerol and shogaol make it effective for relieving joint pain, muscle soreness, and menstrual cramps. Ginger is commonly used to settle upset stomachs, reduce bloating, and enhance nutrient absorption. It also supports cardiovascular health by improving blood circulation and reducing cholesterol levels. Traditional practitioners recommend ginger tea or fresh ginger in meals for daily wellness maintenance.",
  aloe_vera: "Aloe Vera is a succulent plant with cooling and moisturizing properties that has been used for thousands of years in traditional medicine. Its gel is renowned for soothing burns, improving skin health, and supporting digestive wellness. The plant contains powerful compounds like polysaccharides and amino acids that promote skin hydration and collagen production. Aloe vera is effective for treating sunburns, psoriasis, eczema, and general skin irritation when applied topically. When taken internally in appropriate amounts, it can improve gut health, reduce inflammation, and support the immune system. Many beauty and wellness traditions value aloe vera as a natural first-aid remedy.",
  lemon: "Lemon is a citrus fruit rich in vitamin C and antioxidants that aids digestion and boosts immunity. It acts as a natural detoxifier, making it essential in wellness practices across many cultures. The citric acid in lemon helps stimulate digestive juices, improving the breakdown of food and nutrient absorption. Starting your day with warm lemon water can help cleanse the digestive system and boost metabolic activity. Lemons are powerful immune boosters due to their high vitamin C content, which fights free radicals and supports white blood cell production. The fruit also contains flavonoids with anti-inflammatory and antimicrobial properties that protect against infections and support overall wellness.",
  cucumber: "Cucumber is a cooling vegetable with high water content that hydrates the body and soothes skin irritation. It helps reduce internal heat and acidity, making it particularly beneficial in warm climates and seasons. Rich in silica, cucumber supports healthy skin, hair, and nails when consumed regularly. The antioxidants and polyphenols in cucumber help reduce inflammation throughout the body and support heart health. Cucumber juice is traditionally used to calm acid reflux, reduce bloating, and support kidney function. Its mild nature makes it suitable for sensitive digestive systems, and it can be easily incorporated into salads, juices, and wellness beverages.",
  senna: "Senna is a powerful herbal laxative traditionally used to relieve constipation and cleanse the colon naturally. It acts on the digestive system without harsh side effects, stimulating gentle bowel movements through its sennoside compounds. Senna is often recommended for occasional constipation and digestive stagnation, helping restore regular elimination patterns. The herb is gentle enough for short-term use but should be used mindfully as regular use may lead to dependency. Traditional practitioners value senna for its ability to support liver function and overall digestive detoxification. It works best when combined with adequate water intake and dietary fiber for optimal digestive support.",
  licorice: "Licorice root is a sweet herb with remarkable soothing properties and has been a staple in traditional medicine for centuries. It relieves throat irritation, supports digestion, and has been used to treat various respiratory conditions. The active compound glycyrrhizin in licorice has anti-inflammatory, antimicrobial, and immune-boosting properties. Licorice is traditionally used to soothe ulcers, reduce acid reflux, and promote gastric health through its protective mucilage. It also supports adrenal function and helps the body manage stress naturally. The herb enhances the effectiveness of other herbal remedies and is often included in wellness formulations.",
  rose: "Rose petals offer cooling and anti-inflammatory benefits that reduce stress and promote emotional well-being. Used in traditional beauty rituals and wellness practices across cultures, they support skin radiance and digestive health. Rose water and petals contain antioxidants and polyphenols that protect skin from damage and promote a youthful complexion. The aroma of rose is known to have calming and mood-lifting properties, making it valuable for emotional wellness. Rose petals support digestive health by reducing inflammation in the gut and improving circulation. They also contain vitamin C and help with skin hydration, elasticity, and natural glow when used regularly.",
  nux_vomica: "Nux vomica is a potent homeopathic remedy used in microdoses to stimulate digestion and support nervous system function. It is highly toxic in its raw form and only safe in properly prepared homeopathic dilutions. In homeopathic medicine, it is used for digestive complaints, stress-related symptoms, and nervous tension. The remedy is particularly valued for addressing overindulgence, poor digestion, and sluggish metabolic function. Practitioners recommend nux vomica for individuals experiencing fatigue, irritability, and digestive disturbances from lifestyle stress. Always consult a qualified practitioner before using any homeopathic remedies to ensure proper dosage and preparation.",
  calendula: "Calendula flowers are prized for their healing properties and have been used in traditional medicine for wound care and skin health. They accelerate wound healing, reduce inflammation, and are excellent for treating skin conditions and minor injuries. The plant contains powerful compounds like flavonoids and polysaccharides that promote tissue repair and regeneration. Calendula is particularly effective for sensitive or irritated skin, helping to soothe conditions like eczema and dermatitis. It supports the immune system by stimulating white blood cell activity and reducing infection risk. Calendula infused oils and salves are traditional remedies for burns, cuts, and bruises.",
  fennel: "Fennel seeds are aromatic and carminative, helping to reduce bloating and gas naturally. This gentle herb aids digestion and freshens breath, making it a kitchen staple in many wellness traditions. Fennel contains anethole and other compounds that relax digestive muscles and promote smooth food movement. The seeds are traditionally chewed after meals to prevent indigestion and reduce gas formation. Fennel is particularly beneficial for individuals with sensitive digestion or mild IBS symptoms. Its gentle warming properties make it suitable for all ages, and fennel tea is commonly recommended for digestive comfort and intestinal wellness.",
  adathoda: "Adathoda is a respiratory tonic with bronchodilator properties that effectively relieves cough and supports overall respiratory health. It is invaluable for lung wellness and is traditionally used in warm climate regions for respiratory support. The plant contains alkaloids that help relax airways and promote easier breathing in individuals with respiratory challenges. Adathoda is particularly valued for its ability to address productive coughs and support the body's natural mucus clearance. It strengthens lung tissue and supports long-term respiratory resilience when used regularly. Traditional practitioners recommend adathoda for seasonal respiratory support and general lung health maintenance.",
  nilavembu: "Nilavembu is a bitter herb known for its immunity-boosting and anti-malarial properties in traditional medicine. It supports liver function and helps the body fight infections naturally through its powerful bioactive compounds. The herb contains andrographolides which have potent anti-inflammatory and immunomodulatory effects. Nilavembu is traditionally used during seasonal changes to strengthen immunity and prevent illness. It supports healthy liver function and promotes natural detoxification processes in the body. The herb is valued for its ability to reduce fever and support recovery from infections and inflammatory conditions.",
  thuthuvalai: "Thuthuvalai is a respiratory herb traditionally used to treat cough and asthma, strengthening the lungs and supporting healthy breathing. It is particularly effective in warm climates and is valued in South Indian traditional medicine. The plant contains compounds that help clear respiratory congestion and reduce inflammation in airways. Thuthuvalai supports the body's natural ability to expel mucus and maintain clear breathing passages. Regular use is believed to build lung resilience and reduce susceptibility to respiratory infections. The herb is often recommended for individuals with chronic cough or asthma seeking natural support.",
  arnica: "Arnica is renowned for pain relief and healing properties that help with bruises, muscle soreness, and wounds. It accelerates recovery and reduces inflammation naturally when applied topically as an oil or salve. Arnica contains compounds like helenalin that reduce swelling, bruising, and pain from physical trauma and muscle strain. The herb is widely used by athletes and active individuals for post-workout recovery and injury management. It should only be used topically on unbroken skin as it is toxic if ingested internally. Traditional practitioners recommend arnica for sprains, strains, and general musculoskeletal discomfort relief.",
  turmeric: "Turmeric contains curcumin, a powerful anti-inflammatory compound that reduces inflammation and supports liver health. It boosts immunity and is essential in wellness practices across many traditional systems. The active curcuminoids in turmeric provide antioxidant protection and support healthy inflammatory response throughout the body. Turmeric is particularly beneficial for joint health, supporting mobility and flexibility in individuals with inflammatory conditions. It supports cardiovascular health by improving circulation and reducing oxidative stress in blood vessels. Regular turmeric consumption is believed to support cognitive function and promote overall longevity.",
  ashwagandha: "Ashwagandha is an adaptogenic herb that reduces stress and anxiety while enhancing vitality and overall wellness. It promotes quality sleep and supports well-being during challenging times through its unique adaptogenic properties. The herb contains withanolides that help regulate stress hormone levels and promote emotional balance. Ashwagandha is traditionally used to improve energy and stamina while supporting restful sleep quality. It also supports cognitive function, memory, and mental clarity for optimal brain health. The herb is valued by practitioners for its ability to support both physical resilience and emotional well-being.",
  tulsi: "Tulsi, the sacred basil, is an adaptogenic herb revered for stress relief and immunity in traditional practices. It supports respiratory health and acts as a natural immune enhancer through its powerful bioactive compounds. The herb contains eugenol and other compounds that have antimicrobial, anti-inflammatory, and antioxidant properties. Tulsi is traditionally used to support respiratory function, reduce inflammation, and promote healthy immune response. It also supports digestive health and helps the body maintain balanced stress responses naturally. Regular tulsi consumption is believed to promote mental clarity, emotional balance, and spiritual well-being.",
  neem: "Neem is a bitter herb with powerful antibacterial and antifungal properties that purify the blood naturally. It treats various skin conditions and supports metabolic health through its potent bioactive compounds. Neem contains azadirachtin and other compounds that combat harmful bacteria and fungi effectively. The herb is traditionally used for skin conditions like acne, psoriasis, and eczema when taken internally or applied topically. Neem also supports healthy blood sugar levels and promotes natural detoxification processes. Its bitter taste stimulates digestive fire and supports overall metabolic health when used regularly.",
  brahmi: "Brahmi is a nootropic herb that enhances memory and cognitive function while reducing anxiety. It supports mental clarity, making it ideal for students and professionals requiring optimal brain function. The herb contains bacosides that support neural communication and promote brain cell regeneration. Brahmi is traditionally used to improve focus, concentration, and learning ability naturally. It also supports emotional well-being by reducing anxiety and promoting a calm mental state. Regular brahmi use is believed to support long-term cognitive health and may help protect against age-related cognitive decline.",
  amla: "Amla is rich in vitamin C and antioxidants that boost immunity and improve digestion naturally. It promotes hair growth and is a rejuvenating superfruit in Ayurvedic traditions. The fruit contains powerful antioxidants that protect cells from oxidative damage and support immune function. Amla supports healthy digestion, enhances nutrient absorption, and promotes regular elimination. It also nourishes hair follicles and promotes healthy hair growth from within. Regular amla consumption is believed to support skin health, energy levels, and overall vitality and longevity.",
  triphala: "Triphala is a classical Ayurvedic formula combining three fruits that gently cleanses the colon and improves digestion. It supports overall vitality through its balanced combination of three powerful herbs. The formula contains amla, haritaki, and bibhitaki, each contributing unique digestive and rejuvenating properties. Triphala gently promotes regular elimination without causing dependency or harsh side effects. It supports nutrient absorption, reduces inflammation in the digestive tract, and promotes healthy gut flora. Regular triphala use is believed to support vision, energy, and overall systemic health.",
  haritaki: "Haritaki is a rejuvenating fruit that supports digestion and natural detoxification through its powerful bioactive compounds. Known as the king of herbs in Ayurveda, it promotes overall wellness and longevity. The fruit contains tannins and other compounds that support digestive function and promote healthy elimination. Haritaki strengthens the digestive system and improves nutrient absorption over time with regular use. It supports liver function and helps the body eliminate accumulated toxins naturally. The herb is valued for its ability to support multiple body systems and promote anti-aging benefits.",
  guggul: "Guggul resin is known for managing cholesterol and supporting weight loss naturally. It reduces inflammation and supports joint health, making it valuable for metabolic wellness. The resin contains guggulsterones that support healthy cholesterol levels and promote fat metabolism. Guggul is traditionally used to support joint mobility, reduce inflammation, and promote healthy weight management. It also supports cardiovascular health by improving circulation and reducing arterial plaque buildup. Regular guggul use is believed to support thyroid function and boost metabolic rate naturally.",
  shatavari: "Shatavari means 'she who has a hundred husbands' and supports reproductive health and hormonal balance. This rejuvenating herb supports lactation and overall women's wellness through its unique properties. The herb contains saponins that mimic estrogen and support hormonal balance naturally. Shatavari nourishes reproductive tissues and supports fertility for women seeking to conceive. It also increases milk production for nursing mothers and supports recovery after childbirth. The herb is valued as a general rejuvenative that supports vitality and overall wellness in women.",
  guduchi: "Guduchi is an immunomodulator that strengthens immunity and fights chronic infections naturally. It reduces fever and supports recovery from various health conditions through its powerful bioactive compounds. The herb contains compounds that enhance white blood cell activity and promote immune response. Guduchi is traditionally used to support the body during seasonal transitions and when facing immune challenges. It also reduces inflammation and supports the body's natural healing processes. Regular guduchi use is believed to build long-term immune resilience and vitality.",
  bhringraj: "Bhringraj means 'king of herbs for hair' and promotes hair growth and prevents premature graying. It supports liver health and enhances memory, making it prized in traditional beauty care. The herb nourishes hair follicles from within and promotes healthy scalp circulation. Bhringraj also supports cognitive function and helps with stress-related symptoms affecting mental clarity. It strengthens the nervous system and promotes restful sleep when used regularly. Traditional practitioners recommend bhringraj for comprehensive hair, skin, and mental health support.",
  punarnava: "Punarnava means 'renewal' and this diuretic herb supports kidney health and reduces edema naturally. It promotes cardiovascular wellness through natural detoxification and improved circulation. The herb contains compounds that support healthy fluid balance in the body and reduce water retention. Punarnava strengthens the kidneys and urinary system while supporting healthy inflammation response. It also supports heart health by improving circulation and reducing arterial inflammation. Regular use is believed to support overall detoxification and promote vitality through tissue renewal.",
  shankhpushpi: "Shankhpushpi is a nootropic herb that enhances memory and mental clarity while reducing anxiety. It promotes restful sleep and supports cognitive wellness through its calming properties. The herb contains compounds that support neurotransmitter function and promote mental focus. Shankhpushpi is traditionally used to improve learning ability, concentration, and information retention. It also helps reduce nervousness and promotes emotional calm during stressful periods. Regular use is believed to support long-term cognitive health and emotional well-being.",
  manjistha: "Manjistha is a blood purifier with powerful antimicrobial properties that treat skin conditions effectively. It heals wounds and supports overall skin radiance through its potent bioactive compounds. The herb contains anthraquinones that support liver function and promote blood purification. Manjistha is traditionally used for acne, skin inflammation, and wound healing both internally and topically. It also supports lymphatic drainage and helps the body eliminate accumulated toxins. Regular manjistha use is believed to promote clear, healthy skin and overall systemic detoxification.",
  vidanga: "Vidanga is an anthelmintic herb that eliminates intestinal parasites naturally and supports digestive health. It improves digestion and supports skin health through internal cleansing of the digestive tract. The herb contains compounds that are toxic to parasites but safe for human consumption. Vidanga is traditionally used for digestive tract health and to remove unwanted organisms. It also supports nutrient absorption and promotes healthy digestion when the digestive tract is clean. Regular vidanga use is believed to improve energy levels and overall vitality.",
  kutki: "Kutki is a hepatoprotective herb that supports liver health and treats jaundice effectively. It enhances immunity and supports digestive wellness through its powerful liver-supporting compounds. The herb contains picrosides that protect liver cells from damage and promote regeneration. Kutki is traditionally used to support liver function during detoxification and metabolic challenges. It also reduces inflammation in the liver and promotes healthy bile production. Regular kutki use is believed to support comprehensive liver health and overall detoxification capacity.",
  pippali: "Pippali, long pepper, enhances digestive fire and bioavailability of nutrients naturally. It supports respiratory health and acts as a natural bioenhancer for other herbs. The herb contains piperine and other compounds that improve nutrient absorption and enhance metabolism. Pippali is traditionally used to strengthen digestion and improve the effectiveness of herbal formulations. It also supports respiratory function and helps clear congestion naturally. Regular pippali use is believed to support digestive strength and overall metabolic health.",
  bala: "Bala means 'strength' and this rejuvenating herb strengthens muscles and improves stamina. It supports nervous system health through natural vitalization and cellular nourishment. The herb contains compounds that nourish tissues and promote strength and resilience. Bala is traditionally used by athletes and active individuals to support recovery and build stamina. It also supports nervous system function and helps reduce fatigue and weakness. Regular bala use is believed to support overall physical strength, vitality, and longevity.",
  jatamansi: "Jatamansi is a sedative herb that reduces stress and promotes quality sleep naturally. It enhances memory and supports emotional well-being through its calming effects. The herb contains compounds that calm the nervous system and promote restful sleep without dependency. Jatamansi is traditionally used for anxiety, insomnia, and stress-related symptoms. It also supports cognitive function and helps improve memory and mental clarity. Regular jatamansi use is believed to support emotional balance and promote deep, restorative sleep.",
  yashtimadhu: "Yashtimadhu, also called licorice, soothes the throat and treats peptic ulcers effectively. Its demulcent properties support respiratory and digestive wellness through protective coating. The herb contains glycyrrhizin that reduces inflammation and promotes healing in mucous membranes. Yashtimadhu is traditionally used to soothe sore throats, reduce cough, and support respiratory health. It also protects the stomach lining and promotes healing of digestive tract ulcers. Regular yashtimadhu use is believed to support respiratory resilience and digestive comfort.",
  vacha: "Vacha enhances memory and supports clear speech while improving cognitive function naturally. This nootropic herb has been used traditionally to improve mental clarity and communication abilities. The herb contains compounds that support neurotransmitter function and promote brain cell health. Vacha is traditionally used for speech disorders, memory loss, and cognitive decline. It also supports nervous system function and helps improve mental focus and concentration. Regular vacha use is believed to promote clear thinking, eloquent speech, and long-term cognitive health.",
};


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
                <div style={{ backgroundColor: '#F5F5F5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', minHeight: '500px' }}>
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
                        // 2D Image Slideshow
                        <ImageSlideshow plantName={plant.commonName} />
                    )}
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                        <button
                            onClick={() => setIs3DMode(!is3DMode)}
                            className="btn"
                            style={{
                                background: ' #689150ff',
                                color: 'white',
                                fontSize: '1.1rem',
                                padding: '12px 24px',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4), 0 2px 8px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.boxShadow = '0 6px 20px rgba(209, 214, 235, 1), 0 4px 12px rgba(0,0,0,0.15)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.boxShadow = '0 4px 15px rgba(235, 236, 240, 0.4), 0 2px 8px rgba(0,0,0,0.1)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            2D/3D Toggle
                        </button>
                        {is3DMode && (
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                padding: '10px 16px',
                                borderRadius: '10px',
                                fontSize: '0.9rem',
                                color: '#4A5568',
                                fontWeight: '500',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
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
                        <button className="btn btn-outline flex flex-row items-center justify-center" style={{ gap: '8px' }}>
                            <Share2 size={18} /> Share
                        </button>
                    </div>

                    {/* Audio Player */}
                    <AudioPlayer
                        audioSrc={`/assets/audio/${id}.mp3`}
                        plantName={plant.commonName}
                    />
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
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>{plant.description || plantDescriptions[id] || "No description available."}</p>
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
