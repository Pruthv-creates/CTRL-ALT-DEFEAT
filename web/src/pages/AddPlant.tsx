import React, { useState, useRef } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    Upload,
    Leaf,
    Sprout,
    FileText,
    Activity,
    AlertCircle,
    X,
    CheckCircle,
    Loader
} from "lucide-react";

const AddPlant = () => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        commonName: "",
        botanicalName: "",
        description: "",
        uses: "",
        sideEffects: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Centralized file handler (used by both Drop and Click)
    const handleFile = (file: File) => {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        // Reset the input value so the same file can be selected again if needed
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!image) {
                throw new Error("Please upload an image of the plant.");
            }

            // 1. Upload Image
            const storageRef = ref(storage, `plants/${Date.now()}_${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Add to Firestore
            await addDoc(collection(db, "plants"), {
                ...formData,
                imageUrl: downloadURL,
                createdAt: new Date(),
                status: "pending_review",
            });

            setSuccess(true);
            setFormData({
                commonName: "",
                botanicalName: "",
                description: "",
                uses: "",
                sideEffects: "",
            });
            removeImage();
        } catch (err: any) {
            console.error("Error adding plant:", err);
            setError(err.message || "Failed to add plant. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Render ---

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-cover bg-center fixed inset-0 overflow-y-auto"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1920&auto=format&fit=crop")',
            }}
        >
            {/* Dark Overlay for readability */}
            <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-[1px]" />

            <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[2rem] overflow-hidden my-8">

                {/* Header Section */}
                <div className="bg-gradient-to-br from-[#1a4d2e] to-[#0d3d1f] text-white p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <Leaf size={300} className="absolute -top-10 -right-10 rotate-12" />
                        <Leaf size={200} className="absolute bottom-0 -left-10 -rotate-45" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-center items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Leaf className="w-7 h-7 text-[#95d5b2]" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-wide">
                                Contribute to Nature
                            </h1>
                        </div>
                        <p className="text-[#b7e4c7] italic font-light text-base md:text-lg max-w-2xl mx-auto">
                            "The best time to plant a tree was 20 years ago. The second best time is now."
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12">
                    {success ? (
                        // Success View
                        <div className="text-center py-12 animate-fade-in">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <CheckCircle className="text-[#1a4d2e]" size={48} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-4xl font-serif font-bold text-[#1a4d2e] mb-4">
                                Thank You!
                            </h2>
                            <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                                Your contribution has been submitted successfully to our garden database.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="bg-gradient-to-r from-[#1a4d2e] to-[#0d3d1f] text-white px-10 py-4 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg font-bold flex items-center gap-2 mx-auto"
                            >
                                <Upload size={20} /> Add Another Plant
                            </button>
                        </div>
                    ) : (
                        // Form View
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Image Upload Area */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#1a4d2e] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Upload size={16} /> Plant Image
                                </label>
                                <div
                                    className={`relative w-full h-72 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-sm
                    ${dragActive
                                            ? "border-[#1a4d2e] bg-[#1a4d2e]/10 scale-[1.01] shadow-lg"
                                            : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:bg-white hover:border-[#1a4d2e]/60 hover:shadow-md"
                                        }
                  `}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />

                                    {imagePreview ? (
                                        <div className="relative w-full h-full">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />

                                            {/* Remove Image Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                className="absolute top-4 right-4 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl transition-all hover:scale-110 z-20"
                                            >
                                                <X size={18} strokeWidth={2.5} />
                                            </button>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                                <p className="text-white font-semibold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                                                    <Upload size={18} /> Change Image
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-8 transition-transform group-hover:scale-105 duration-300">
                                            <div className="w-20 h-20 bg-gradient-to-br from-[#1a4d2e]/10 to-[#1a4d2e]/5 text-[#1a4d2e] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                                                <Upload size={36} strokeWidth={2} />
                                            </div>
                                            <p className="text-xl font-semibold text-gray-800 mb-2">Click or drag to upload</p>
                                            <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Input Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#1a4d2e] uppercase tracking-wider ml-1 flex items-center gap-2">
                                        <Sprout size={16} /> Common Name
                                    </label>
                                    <input
                                        type="text"
                                        name="commonName"
                                        value={formData.commonName}
                                        onChange={handleChange}
                                        placeholder="e.g. Tulsi"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none transition-all shadow-sm hover:shadow-md text-lg"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#1a4d2e] uppercase tracking-wider ml-1 flex items-center gap-2">
                                        <FileText size={16} /> Botanical Name
                                    </label>
                                    <input
                                        type="text"
                                        name="botanicalName"
                                        value={formData.botanicalName}
                                        onChange={handleChange}
                                        placeholder="e.g. Ocimum tenuiflorum"
                                        className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none transition-all shadow-sm hover:shadow-md italic text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Text Areas */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#1a4d2e] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <FileText size={16} /> Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Tell us about this plant... What does it look like? Where does it grow?"
                                    className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none transition-all resize-none leading-relaxed shadow-sm hover:shadow-md text-lg"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#1a4d2e] uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Activity size={16} /> Medicinal Uses
                                </label>
                                <textarea
                                    name="uses"
                                    value={formData.uses}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="e.g. Treating colds, stress relief, skin care..."
                                    className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none transition-all resize-none leading-relaxed shadow-sm hover:shadow-md text-lg"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-amber-700 uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <AlertCircle size={16} /> Side Effects (Optional)
                                </label>
                                <textarea
                                    name="sideEffects"
                                    value={formData.sideEffects}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any precautions or known side effects..."
                                    className="w-full px-5 py-4 bg-gradient-to-br from-amber-50/50 to-white border-2 border-amber-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none transition-all resize-none placeholder-amber-900/40 text-amber-900 leading-relaxed shadow-sm hover:shadow-md text-lg"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-gradient-to-r from-red-50 to-red-100/50 text-red-700 p-4 rounded-xl flex items-center justify-center gap-3 text-base font-semibold border-2 border-red-200 shadow-sm">
                                    <AlertCircle size={20} strokeWidth={2.5} /> {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#1a4d2e] to-[#0d3d1f] hover:from-[#143d23] hover:to-[#0a2f18] text-white font-bold py-5 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={22} strokeWidth={2.5} /> Publishing...
                                    </>
                                ) : (
                                    <>
                                        Submit Contribution
                                        <Leaf className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                                    </>
                                )}
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddPlant;

