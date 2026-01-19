import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "plants"));
        const plantData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlants(plantData);
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) {
    return <p>Loading plants...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌿 Medicinal Plants (AYUSH)</h2>

      {plants.length === 0 && <p>No plants found.</p>}

      {plants.map(plant => (
        <div
          key={plant.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>{plant.commonName}</h3>
          <p><strong>Botanical Name:</strong> {plant.botanicalName}</p>

          <p>
            <strong>AYUSH Systems:</strong>{" "}
            {plant.ayushSystems?.join(", ")}
          </p>

          <p>
            <strong>Disease Categories:</strong>{" "}
            {plant.diseaseCategories?.join(", ")}
          </p>

          <p>
            <strong>Medicinal Properties:</strong>
          </p>
          <ul>
            {plant.medicinalProperties?.map((prop, index) => (
              <li key={index}>{prop}</li>
            ))}
          </ul>

          {plant.media?.images?.length > 0 && (
            <img
              src={plant.media.images[0]}
              alt={plant.commonName}
              width="200"
              style={{ borderRadius: "8px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PlantList;
