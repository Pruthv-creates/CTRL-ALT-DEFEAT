import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import PlantCard from '../components/PlantCard';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import './Bookmarks.css';

const Bookmarks = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchBookmarks(currentUser.uid);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchBookmarks = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'Users', uid));
            if (userDoc.exists()) {
                const bookmarkIds = userDoc.data().bookmarks || [];

                if (bookmarkIds.length > 0) {
                    const plantPromises = bookmarkIds.map(id =>
                        getDoc(doc(db, 'plants', id))
                    );
                    const plantSnapshots = await Promise.all(plantPromises);

                    const fetchedPlants = plantSnapshots
                        .filter(snap => snap.exists())
                        .map(snap => ({ id: snap.id, ...snap.data() }));

                    setPlants(fetchedPlants);
                } else {
                    setPlants([]);
                }
            }
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="section container">Loading your garden...</div>;
    }

    if (!user) {
        return (
            <div className="section container login-required flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="flex items-center gap-3">
                    <Bookmark size={48} className="bookmark-icon" />
                    <h2 className="m-0">Please Log In</h2>
                </div>
                <p className="text-center">You need to be logged in to view your saved plants.</p>
                <Link to="/user-login" className="btn btn-primary">
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="section container">
            <h1 className="page-title">My Herbal Collection</h1>
            <p className="page-subtitle">
                {plants.length} plant{plants.length !== 1 ? 's' : ''} saved to your personal library.
            </p>

            {plants.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't bookmarked any plants yet.</p>
                    <Link to="/explore" className="btn btn-outline">
                        Explore Plants
                    </Link>
                </div>
            ) : (
                <div className="plants-grid">
                    {plants.map(plant => (
                        <PlantCard key={plant.id} plant={plant} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
