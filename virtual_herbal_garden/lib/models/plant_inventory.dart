class PlantInventory {
  final String plantId;
  final int price;
  final int stock;
  final bool isAvailable;

  PlantInventory({
    required this.plantId,
    required this.price,
    required this.stock,
    required this.isAvailable,
  });

  factory PlantInventory.fromFirestore(
    String id,
    Map<String, dynamic> data,
  ) {
    return PlantInventory(
      plantId: id,
      price: data['price'] ?? 0,
      stock: data['stock'] ?? 0,
      isAvailable: data['isAvailable'] ?? false,
    );
  }
}
