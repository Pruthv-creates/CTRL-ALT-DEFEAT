import React from "react";
import { auth, db } from "../firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { Bookmark } from "lucide-react";

const BookmarkButton = ({ plantId }: { plantId: string }) => {
    const handleBookmark = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return alert("Please log in first");
        await updateDoc(doc(db, "Users", uid), {
            bookmarks: arrayUnion(plantId),
        });
        alert("Bookmarked!");
    };

    return (
        <button
            className="btn btn-outline"
            style={{ gap: '8px' }}
            onClick={handleBookmark}
        >
            <Bookmark size={18} /> Save
        </button>
    );
};

export default BookmarkButton;
