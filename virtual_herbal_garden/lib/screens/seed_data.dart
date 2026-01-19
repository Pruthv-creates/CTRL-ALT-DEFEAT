import 'package:cloud_firestore/cloud_firestore.dart';

class SeedDataService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Future<void> addTulsi() async {
    await _db.collection('plants').doc('tulsi').set({
      "commonName": "Tulsi",
      "botanicalName": "Ocimum sanctum",
      "ayushSystems": ["Ayurveda", "Yoga"],

      "description":
          "Tulsi is a sacred medicinal plant widely used in Ayurveda for its healing properties.",

      "medicinalProperties": [
        "Immunity booster",
        "Anti-inflammatory",
        "Antioxidant"
      ],

      "therapeuticUses": [
        "Cold and cough",
        "Respiratory disorders",
        "Stress relief"
      ],

      "precautions": [
        "Avoid excessive consumption during pregnancy"
      ],

      "plantPartsUsed": ["Leaves", "Seeds"],

      "diseaseCategories": [
        "Respiratory",
        "Immunity"
      ],

      "regionalOrigin": [
        "India",
        "Southeast Asia"
      ],

      "media": {
        "images": [
          "https://your-storage-url/tulsi_1.jpg"
        ],
        "videos": [],
        "audio": [],
        "model3D":
            "https://your-storage-url/tulsi.glb"
      },

      "createdAt": Timestamp.now(),
      "updatedAt": Timestamp.now(),
    });
  }
}
