import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { updateDoc, doc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { Bookmark } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BookmarkButton = ({ plantId }: { plantId: string }) => {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkBookmark = async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) return;

            const userDoc = await getDoc(doc(db, "Users", uid));
            const bookmarks = userDoc.data()?.bookmarks || [];
            setIsSaved(bookmarks.includes(plantId));
        };

        checkBookmark();
    }, [plantId]);

    const handleBookmark = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            toast.error("Please log in first", {
                position: "top-right",
                duration: 3000,
            });
            return;
        }

        if (isSaved) {
            // Remove bookmark
            await updateDoc(doc(db, "Users", uid), {
                bookmarks: arrayRemove(plantId),
            });

            setIsSaved(false);
            toast("Removed from bookmarks!", {
                position: "top-right",
                duration: 3000,
                icon: "🗑️",
            });
            return;
        }

        await updateDoc(doc(db, "Users", uid), {
            bookmarks: arrayUnion(plantId),
        });

        setIsSaved(true);
        toast.success("Added to bookmarks!", {
            position: "top-right",
            duration: 3000,
        });
    };

    return (
        <>
            <Toaster />
            <button
                className="btn btn-outline flex flex-row items-center justify-center"
                style={{ gap: '8px' }}
                onClick={handleBookmark}
            >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? "Saved" : "Save"}
            </button>
        </>
    );
};

export default BookmarkButton;
