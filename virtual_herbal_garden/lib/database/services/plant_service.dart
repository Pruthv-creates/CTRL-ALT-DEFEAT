import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:virtual_herbal_garden/models/plant.dart';

class PlantService {
  final _db = FirebaseFirestore.instance;

  Stream<List<Plant>> getPlants() {
    return _db.collection('plants').snapshots().map(
      (snapshot) => snapshot.docs
          .map((doc) => Plant.fromFirestore(doc.id, doc.data()))
          .toList(),
    );
  }
}
