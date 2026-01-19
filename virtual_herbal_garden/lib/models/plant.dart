class Plant {
  final String id;
  final String commonName;
  final String botanicalName;
  final List<String> ayushSystems;
  final List<String> medicinalProperties;
  final List<String> therapeuticUses;
  final List<String> precautions;
  final List<String> diseaseCategories;
  final List<String> plantPartsUsed;
  final String model3D;
  final List<String> images;

  Plant({
    required this.id,
    required this.commonName,
    required this.botanicalName,
    required this.ayushSystems,
    required this.medicinalProperties,
    required this.therapeuticUses,
    required this.precautions,
    required this.diseaseCategories,
    required this.plantPartsUsed,
    required this.model3D,
    required this.images,
  });

  factory Plant.fromFirestore(String id, Map<String, dynamic> data) {
    return Plant(
      id: id,
      commonName: data['commonName'],
      botanicalName: data['botanicalName'],
      ayushSystems: List<String>.from(data['ayushSystems']),
      medicinalProperties:
          List<String>.from(data['medicinalProperties']),
      therapeuticUses: List<String>.from(data['therapeuticUses']),
      precautions: List<String>.from(data['precautions']),
      diseaseCategories:
          List<String>.from(data['diseaseCategories']),
      plantPartsUsed:
          List<String>.from(data['plantPartsUsed']),
      model3D: data['media']['model3D'],
      images: List<String>.from(data['media']['images']),
    );
  }
}
