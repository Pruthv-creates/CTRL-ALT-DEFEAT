import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const UserDashboard = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data()?.username || "");
          }
        }
      });
      return () => unsubscribe();
    }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const userDoc = await getDoc(doc(db, "users", uid));
      setBookmarks(userDoc.data()?.bookmarks || []);
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      {username && <p>Welcome {username}!</p>}
      <h2 className="text-xl mb-6">Your Bookmarked Plants</h2>

      {bookmarks.length === 0 ? (
        <div className="text-center bg-gray-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">
            You haven't bookmarked any plants yet.
          </p>
          <a
            href="/explore"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Explore Plants
          </a>
        </div>
      ) : (
        <ul className="space-y-2">
          {bookmarks.map((id) => (
            <li
              key={id}
              className="p-3 border rounded-md shadow-sm hover:bg-gray-50 transition"
            >
              {id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;
