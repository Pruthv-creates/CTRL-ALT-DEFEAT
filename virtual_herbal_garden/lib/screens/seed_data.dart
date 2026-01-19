import 'package:cloud_firestore/cloud_firestore.dart';

class SeedDataService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Future<void> addPlants() async {
    final plants = [
      {
        "commonName": "Ginger",
        "botanicalName": "Zingiber officinale",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": [
          "Anti-nausea",
          "Anti-inflammatory",
          "Digestive stimulant"
        ],
        "therapeuticUses": [
          "Relieves nausea",
          "Improves digestion",
          "Reduces joint pain"
        ],
        "precautions": [
          "Avoid excessive intake with blood thinners"
        ],
        "diseaseCategories": ["Digestive", "Respiratory"],
        "plantPartsUsed": ["Rhizome"],
        "model3D": "https://example.com/models/ginger.glb",
        "images": [
          "https://example.com/images/ginger1.jpg",
          "https://example.com/images/ginger2.jpg"
        ]
      },
      {
        "commonName": "Aloe Vera",
        "botanicalName": "Aloe barbadensis miller",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": [
          "Anti-inflammatory",
          "Cooling",
          "Moisturizing"
        ],
        "therapeuticUses": [
          "Soothes skin burns",
          "Improves digestion",
          "Promotes wound healing"
        ],
        "precautions": ["Avoid excessive oral consumption"],
        "diseaseCategories": ["Skin", "Digestive"],
        "plantPartsUsed": ["Gel"],
        "model3D": "https://example.com/models/aloe_vera.glb",
        "images": [
          "https://example.com/images/aloe1.jpg",
          "https://example.com/images/aloe2.jpg"
        ]
      }
    ];

    for (final plant in plants) {
      await _db
          .collection('plants')
          .doc(plant['commonName'].toString().toLowerCase())
          .set(plant);
    }
  }
}
