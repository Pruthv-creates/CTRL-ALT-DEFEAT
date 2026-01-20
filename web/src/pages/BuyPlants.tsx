import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
    Search,
    ShoppingBag,
    Leaf,
    DollarSign,
    Package,
    Loader,
    Filter,
    ShoppingCart,
    Check
} from "lucide-react";
import { useCart } from "../context/CartContext";

interface Plant {
    id: string;
    commonName: string;
    botanicalName?: string;
    description?: string;
    price?: number;
    stock?: number;
    isForSale?: boolean;
    imageUrl?: string;
    categoryTag?: string;
    media?: {
        images?: string[];
    };
}

const SAMPLE_PLANTS: Plant[] = [
    {
        id: "sample-1",
        commonName: "Ashwagandha",
        botanicalName: "Withania somnifera",
        description: "Known as Indian Ginseng, Ashwagandha is a powerful adaptogenic herb used in Ayurveda for stress relief, improving energy, and boosting immunity. The roots are primarily used for medicinal purposes.",
        price: 299,
        stock: 25,
        isForSale: true,
        imageUrl: "/assets/images/ashwagandha1.jpg",
        categoryTag: "Adaptogen"
    },
    {
        id: "sample-2",
        commonName: "Brahmi",
        botanicalName: "Bacopa monnieri",
        description: "A renowned brain tonic in Ayurveda, Brahmi enhances memory, concentration, and cognitive function. It's also known for its calming properties and is used to reduce anxiety and stress.",
        price: 199,
        stock: 18,
        isForSale: true,
        imageUrl: "/assets/images/brahmi1.jpg",
        categoryTag: "Brain Health"
    },
    {
        id: "sample-3",
        commonName: "Neem",
        botanicalName: "Azadirachta indica",
        description: "The 'village pharmacy' of India, Neem has powerful antibacterial, antifungal, and blood-purifying properties. Every part of the plant is used for various medicinal purposes.",
        price: 249,
        stock: 30,
        isForSale: true,
        imageUrl: "/assets/images/neem1.jpg",
        categoryTag: "Antibacterial"
    },
    {
        id: "sample-4",
        commonName: "Turmeric",
        botanicalName: "Curcuma longa",
        description: "A golden spice with powerful anti-inflammatory and antioxidant properties. Turmeric is widely used in Ayurveda for joint health, digestion, and skin care. The rhizome is the medicinal part.",
        price: 149,
        stock: 0,
        isForSale: true,
        imageUrl: "/assets/images/turmeric1.jpg",
        categoryTag: "Anti-inflammatory"
    },
    {
        id: "sample-5",
        commonName: "Amla (Indian Gooseberry)",
        botanicalName: "Phyllanthus emblica",
        description: "Rich in Vitamin C and antioxidants, Amla is one of the most important rejuvenating herbs in Ayurveda. It supports immunity, digestion, hair health, and overall vitality.",
        price: 179,
        stock: 22,
        isForSale: true,
        imageUrl: "/assets/images/amla1.jpg",
        categoryTag: "Immunity"
    },
    {
        id: "sample-6",
        commonName: "Tulsi (Holy Basil)",
        botanicalName: "Ocimum sanctum",
        description: "Sacred in Hindu tradition, Tulsi is a powerful adaptogen that supports respiratory health, reduces stress, and boosts immunity. It's known as the 'Queen of Herbs' in Ayurveda.",
        price: 129,
        stock: 35,
        isForSale: true,
        imageUrl: "/assets/images/tulsi1.jpg",
        categoryTag: "Sacred"
    },
    {
        id: "sample-7",
        commonName: "Aloe Vera",
        botanicalName: "Aloe barbadensis miller",
        description: "A succulent plant with cooling and healing properties. Aloe Vera is used for skin care, digestive health, and wound healing. The gel from its leaves has numerous medicinal applications.",
        price: 99,
        stock: 40,
        isForSale: true,
        imageUrl: "/assets/images/aloe1.jpg",
        categoryTag: "Skin Care"
    },
    {
        id: "sample-8",
        commonName: "Ginger",
        botanicalName: "Zingiber officinale",
        description: "A warming herb excellent for digestion, nausea relief, and inflammation. Ginger is widely used in both culinary and medicinal applications across various traditional medicine systems.",
        price: 89,
        stock: 28,
        isForSale: true,
        imageUrl: "/assets/images/ginger1.jpg",
        categoryTag: "Digestive"
    }
];

const BuyPlants = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [addedToCart, setAddedToCart] = useState<string | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchPlants = async () => {
            setLoading(true);
            try {
                // Fetch plants that are for selling
                // note: requires an index in Firestore if combined with other text filters later
                // For now, we'll fetch all and filter in memory or filtered query if possible.
                // Since 'isForSale' is a new field, some old plants might not have it.
                // We'll fetch all 'active' plants and filter.

                // Construct query - ideally: query(collection(db, "plants"), where("isForSale", "==", true));
                // But let's be safe and fetch all for now and filter manually to avoid index errors during dev.
                const querySnapshot = await getDocs(collection(db, "plants"));
                const plantData = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Plant))
                    .filter(plant => plant.isForSale === true); // Only show items for sale

                // Combine fetched data with sample data
                // Note: In a real app, you might want to deduplicate or only use one source
                setPlants([...SAMPLE_PLANTS, ...plantData]);
            } catch (error) {
                console.error("Error fetching plants:", error);
                // Even if fetch fails, show samples
                setPlants(SAMPLE_PLANTS);
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, []);

    const filteredPlants = plants.filter(plant =>
        plant.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f0ead8]">

            {/* Search and Filter */}
            <div className="container mx-auto px-4 mt-8 relative z-20">
                <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search plants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#f0f0f0] text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-6 py-16">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin text-[#1a4d2e]" size={48} />
                    </div>
                ) : filteredPlants.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
                        <h2 className="text-2xl font-bold mb-2">No plants found</h2>
                        <p>Currently there are no plants listed for sale matching your criteria.</p>
                        <Link to="/add-plant" className="text-[#1a4d2e] font-semibold hover:underline mt-4 inline-block">
                            Have something to sell? Contribute now.
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredPlants.map((plant) => (
                            <div key={plant.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
                                {/* Image */}
                                <div className="h-64 relative overflow-hidden bg-gray-100">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                                    <img
                                        src={plant.imageUrl || plant.media?.images?.[0] || 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop'}
                                        alt={plant.commonName}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {(plant.stock || 0) <= 5 && (plant.stock || 0) > 0 && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg">
                                            Low Stock
                                        </div>
                                    )}
                                    {(plant.stock || 0) === 0 && (
                                        <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg">
                                            Out of Stock
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-[#1a4d2e] mb-1 group-hover:text-[#4a6b3a] transition-colors line-clamp-1">
                                        {plant.commonName}
                                    </h3>
                                    <p className="text-sm text-gray-400 italic mb-4 line-clamp-1">
                                        {plant.botanicalName}
                                    </p>

                                    {/* Description preview */}
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                                        {plant.description}
                                    </p>

                                    {/* Action Footer */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price</span>
                                            <span className="text-2xl font-bold text-[#1a4d2e] flex items-center">
                                                ₹{plant.price}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if ((plant.stock || 0) > 0) {
                                                    addToCart({
                                                        id: plant.id,
                                                        commonName: plant.commonName,
                                                        botanicalName: plant.botanicalName,
                                                        price: plant.price || 0,
                                                        stock: plant.stock || 0,
                                                        imageUrl: plant.imageUrl || plant.media?.images?.[0]
                                                    });
                                                    setAddedToCart(plant.id);
                                                    setTimeout(() => setAddedToCart(null), 2000);
                                                }
                                            }}
                                            className={`p-3 rounded-2xl transition-all shadow-md flex items-center gap-2 ${addedToCart === plant.id
                                                ? "bg-green-500 text-white"
                                                : (plant.stock || 0) > 0
                                                    ? "bg-[#1a4d2e] text-white hover:bg-[#143d23] hover:shadow-lg active:scale-95"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                }`}
                                            disabled={(plant.stock || 0) === 0}
                                        >
                                            {addedToCart === plant.id ? (
                                                <>
                                                    <Check size={20} />
                                                    <span className="text-sm font-bold hidden md:block">Added!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart size={20} />
                                                    <span className="text-sm font-bold hidden md:block">Add to Cart</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyPlants;
