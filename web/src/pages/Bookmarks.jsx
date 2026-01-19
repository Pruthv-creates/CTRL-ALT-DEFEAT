import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import PlantCard from '../components/PlantCard';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

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
            // Get user's bookmarks list
            const userDoc = await getDoc(doc(db, "Users", uid));
            if (userDoc.exists()) {
                const bookmarkIds = userDoc.data().bookmarks || [];

                if (bookmarkIds.length > 0) {
                    // Fetch details for each bookmarked plant
                    // Note: In production you might want to batched queries or store a summary in user doc
                    const plantPromises = bookmarkIds.map(id => getDoc(doc(db, "plants", id)));
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
            console.error("Error fetching bookmarks:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container section">Loading your garden...</div>;

    if (!user) {
        return (
            <div className="container section" style={{ textAlign: 'center', padding: '60px 0' }}>
                <Bookmark size={48} color="var(--color-primary)" style={{ marginBottom: '20px' }} />
                <h2>Please Log In</h2>
                <p style={{ marginBottom: '20px' }}>You need to be logged in to view your saved plants.</p>
                <Link to="/user-login" className="btn btn-primary">Login Now</Link>
            </div>
        );
    }

    return (
        <div className="container section">
            <h1 style={{ marginBottom: '10px' }}>My Herbal Collection</h1>
            <p style={{ marginBottom: '40px', color: 'var(--color-text-light)' }}>
                {plants.length} plant{plants.length !== 1 ? 's' : ''} saved to your personal library.
            </p>

            {plants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px' }}>
                    <p style={{ marginBottom: '20px' }}>You haven't bookmarked any plants yet.</p>
                    <Link to="/explore" className="btn btn-outline">Explore Plants</Link>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '24px'
                }}>
                    {plants.map(plant => (
                        <PlantCard key={plant.id} plant={plant} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
