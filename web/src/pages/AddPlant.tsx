import React, { useState, useRef } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    Upload,
    Leaf,
    X,
    CheckCircle,
    Loader,
    AlertCircle
} from "lucide-react";

interface AddPlantProps {
    onClose?: () => void;
}

const AddPlant = ({ onClose }: AddPlantProps) => {
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

    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
            style={{
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(0,0,0,0.6)"
            }}
        >
            {/* Close on background click */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-5xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[2rem] overflow-hidden my-auto max-h-[90vh] flex flex-col z-10 transition-all duration-300">

                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-none transition-all"
                    >
                        <X size={24} />
                    </button>
                )}

                {/* Header Section */}
                <div className="bg-gradient-to-br from-[#1a4d2e] to-[#0d3d1f] text-white p-8 text-center relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <Leaf size={300} className="absolute -top-10 -right-10 rotate-12" />
                        <Leaf size={200} className="absolute bottom-0 -left-10 -rotate-45" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-center items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Leaf className="w-6 h-6 text-[#95d5b2]" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">
                                Contribute to Nature
                            </h1>
                        </div>
                        <p className="text-[#b7e4c7] italic font-light text-sm md:text-base max-w-2xl mx-auto">
                            "The best time to plant a tree was 20 years ago. The second best time is now."
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-10 bg-gray-50/50 flex-1 overflow-y-auto">
                    {success ? (
                        // Success View
                        <div className="text-center py-12 animate-fade-in flex flex-col items-center justify-center h-full">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <CheckCircle className="text-[#1a4d2e]" size={48} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-[#1a4d2e] mb-4">
                                Thank You!
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                                Your contribution has been submitted successfully to our garden database.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="bg-gradient-to-r from-[#1a4d2e] to-[#0d3d1f] text-white px-8 py-3 rounded-lg hover:shadow-xl transition-all transform hover:scale-105 shadow-md font-semibold flex items-center gap-2 mx-auto"
                            >
                                <Upload size={18} /> Add Another Plant
                            </button>
                        </div>
                    ) : (
                        // Form View
                        <form onSubmit={handleSubmit} className="flex flex-col md:grid md:grid-cols-12 gap-8 h-full">

                            {/* LEFT COLUMN: Image Upload */}
                            {/* FIXED: Changed gap-2 to space-y-1.5 to align vertically with right inputs */}
                            <div className="md:col-span-5 w-full flex flex-col space-y-1.5">
                                {/* FIXED: Removed justify-center/text-center, added ml-1 to align with right labels */}
                                <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-wider flex items-center gap-2 ml-1">
                                    <Upload size={14} /> Plant Image
                                </label>
                                <div
                                    className={`relative w-full aspect-[4/5] md:aspect-video md:h-full max-h-[400px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-sm bg-white rounded-none
                                    ${dragActive
                                            ? "border-[#1a4d2e] bg-[#1a4d2e]/5 shadow-md"
                                            : "border-gray-300 hover:border-[#1a4d2e]/60 hover:shadow-md hover:bg-white"
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
                                        <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />

                                            {/* Overlay Controls */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                                                <p className="text-white font-medium bg-black/50 px-4 py-2 backdrop-blur-md text-sm rounded-none">Change Image</p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                    className="p-2 bg-red-500/80 hover:bg-red-600 text-white transition-transform hover:scale-110 rounded-none"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 space-y-3">
                                            <div className="w-16 h-16 bg-[#1a4d2e]/10 text-[#1a4d2e] flex items-center justify-center mx-auto shadow-sm rounded-none">
                                                <Upload size={28} strokeWidth={2} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-gray-700">Upload Photo</p>
                                                <p className="text-xs text-gray-400">JPG, PNG or GIF (max. 5MB)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Form Inputs */}
                            <div className="md:col-span-7 flex flex-col gap-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-wider ml-1">
                                            Common Name
                                        </label>
                                        <input
                                            type="text"
                                            name="commonName"
                                            value={formData.commonName}
                                            onChange={handleChange}
                                            placeholder="e.g. Tulsi"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none transition-all shadow-sm text-sm border-b-2"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-wider ml-1">
                                            Botanical Name
                                        </label>
                                        <input
                                            type="text"
                                            name="botanicalName"
                                            value={formData.botanicalName}
                                            onChange={handleChange}
                                            placeholder="e.g. Ocimum"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none transition-all shadow-sm text-sm italic border-b-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-wider ml-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Plant description..."
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none transition-all resize-none shadow-sm text-sm border-b-2"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#1a4d2e] uppercase tracking-wider ml-1">
                                        Medicinal Uses
                                    </label>
                                    <textarea
                                        name="uses"
                                        value={formData.uses}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="e.g. Colds, Stress..."
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-[#1a4d2e]/20 focus:border-[#1a4d2e] outline-none transition-all resize-none shadow-sm text-sm border-b-2"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wider ml-1">
                                        Side Effects
                                    </label>
                                    <textarea
                                        name="sideEffects"
                                        value={formData.sideEffects}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Optional precautions..."
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none transition-all resize-none shadow-sm text-sm placeholder-gray-400 border-b-2"
                                    />
                                </div>

                                {/* Error Message & Search Button */}
                                <div className="mt-auto space-y-4 pt-2">
                                    {error && (
                                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-none text-sm flex items-center justify-center gap-2">
                                            <AlertCircle size={16} /> {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="w-full bg-transparent border-2 border-gray-300 text-gray-600 font-bold py-3.5 rounded-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <X size={20} /> Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#1a4d2e] hover:bg-[#143d23] text-white font-bold py-3.5 rounded-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader className="animate-spin" size={20} /> Publishing...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Contribution
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddPlant;