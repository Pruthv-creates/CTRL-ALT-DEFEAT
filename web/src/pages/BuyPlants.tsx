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
        commonName: "Aloe Vera",
        botanicalName: "Aloe barbadensis miller",
        description: "A succulent plant species of the genus Aloe. It is widely distributed, and is considered an invasive species in many world regions. An evergreen perennial, it originates from the Arabian Peninsula, but grows wild in tropical, semi-tropical, and arid climates around the world.",
        price: 350,
        stock: 15,
        isForSale: true,
        imageUrl: "https://images.unsplash.com/photo-1628005398270-43896dfa99ae?q=80&w=2070&auto=format&fit=crop",
        categoryTag: "Medicinal"
    },
    {
        id: "sample-2",
        commonName: "Tulsi (Holy Basil)",
        botanicalName: "Ocimum tenuiflorum",
        description: "Holy basil, also known as Tulsi, is an aromatic perennial plant in the family Lamiaceae. It is native to the Indian subcontinent and widespread as a cultivated plant throughout the Southeast Asian tropics.",
        price: 150,
        stock: 42,
        isForSale: true,
        imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d71321?q=80&w=1974&auto=format&fit=crop",
        categoryTag: "Sacred"
    },
    {
        id: "sample-3",
        commonName: "Snake Plant",
        botanicalName: "Dracaena trifasciata",
        description: "A species of flowering plant in the family Asparagaceae, native to tropical West Africa from Nigeria east to the Congo. It is most commonly known as the snake plant, Saint George's sword, mother-in-law's tongue, and viper's bowstring hemp.",
        price: 550,
        stock: 8,
        isForSale: true,
        imageUrl: "https://images.unsplash.com/photo-1599598425947-d352778da795?q=80&w=2069&auto=format&fit=crop",
        categoryTag: "Air Purifier"
    },
    {
        id: "sample-4",
        commonName: "Mint",
        botanicalName: "Mentha",
        description: "Mint is a genus of plants in the family Lamiaceae (mint family). The exact distinction between species is unclear; it is estimated that 13 to 24 species exist. Hybridization between some of the species occurs naturally.",
        price: 99,
        stock: 0,
        isForSale: true,
        imageUrl: "https://images.unsplash.com/photo-1626466360052-406e30152998?q=80&w=2070&auto=format&fit=crop",
        categoryTag: "Herb"
    },
    {
        id: "sample-5",
        commonName: "Lavender",
        botanicalName: "Lavandula",
        description: "Lavandula (common name lavender) is a genus of 47 known species of flowering plants in the mint family, Lamiaceae. It is native to the Old World and is found in Cape Verde and the Canary Islands, and from Europe across to northern and eastern Africa, the Mediterranean, southwest Asia to China (Chaix) and southeast India.",
        price: 450,
        stock: 12,
        isForSale: true,
        imageUrl: "https://images.unsplash.com/photo-1565578768222-7729177a67f0?q=80&w=2072&auto=format&fit=crop",
        categoryTag: "Aromatic"
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
            {/* Header / Hero Section */}
            <div className="bg-[#1a4d2e] text-white pt-24 pb-12 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Leaf size={400} className="absolute -top-20 -right-20 rotate-12 text-white" />
                    <ShoppingBag size={300} className="absolute bottom-0 -left-10 -rotate-12 text-white" />
                </div>

                <div className="container mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-sm flex items-center justify-center gap-4">
                        <ShoppingBag className="text-[#95d5b2]" size={48} />
                        Herbal Marketplace
                    </h1>
                    <p className="text-[#b7e4c7] text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Bring nature home. Discover rare medicinal plants and seeds from our community growers.
                    </p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
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
