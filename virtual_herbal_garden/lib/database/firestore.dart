import 'package:cloud_firestore/cloud_firestore.dart';

import 'package:virtual_herbal_garden/models/plant.dart';

/*
this database stores plant morpholical data of AHYUSH plants

firestore collections
users/
plants/
categories/
tours/
bookmarks/
notes/

plants collection document structure:
{
  "commonName": "Tulsi",
  "botanicalName": "Ocimum sanctum",
  "ayushSystems": ["Ayurveda", "Yoga"],
  "description": "A sacred medicinal plant widely used in Ayurveda.",
  
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
  "diseaseCategories": ["Respiratory", "Immunity"],
  "regionalOrigin": ["India", "Southeast Asia"],

  "media": {
    "images": [
      "https://firebasestorage/plant/tulsi1.jpg"
    ],
    "videos": [
      "https://firebasestorage/plant/tulsi.mp4"
    ],
    "audio": [
      "https://firebasestorage/plant/tulsi_audio.mp3"
    ],
    "model3D": "https://firebasestorage/plant/tulsi.glb"
  },

  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}

-
categories
 ├── diseaseCategories
 ├── plantParts
 ├── ayushSystems
 └── regions

{
  "name": "Disease Categories",
  "values": [
    "Respiratory",
    "Digestive",
    "Skin",
    "Immunity",
    "Mental Health"
  ]
}


*/

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// Get all plants
  Future<List<Plant>> getPlants() async {
    final snapshot = await _db.collection('plants').get();
    return snapshot.docs
        .map((doc) => Plant.fromFirestore(doc.id, doc.data()))
        .toList();
  }

  /// Filter plants by disease category
  Future<List<Plant>> filterByDisease(String disease) async {
    final snapshot = await _db
        .collection('plants')
        .where('diseaseCategories', arrayContains: disease)
        .get();

    return snapshot.docs
        .map((doc) => Plant.fromFirestore(doc.id, doc.data()))
        .toList();
  }

  /// Get single plant
  Future<Plant> getPlantById(String id) async {
    final doc = await _db.collection('plants').doc(id).get();
    return Plant.fromFirestore(doc.id, doc.data()!);
  }
}
