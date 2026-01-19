import 'package:flutter/material.dart';
import '../database/firestore.dart';
import '../models/plant.dart';

class PlantListScreen extends StatelessWidget {
  final FirestoreService _service = FirestoreService();

  PlantListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Virtual Herbal Garden')),
      body: FutureBuilder<List<Plant>>(
        future: _service.getPlants(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final plants = snapshot.data!;
          return ListView.builder(
            itemCount: plants.length,
            itemBuilder: (context, index) {
              final plant = plants[index];
              return ListTile(
                leading: Image.network(
                  plant.images.first,
                  width: 50,
                  fit: BoxFit.cover,
                ),
                title: Text(plant.commonName),
                subtitle: Text(plant.botanicalName),
              );
            },
          );
        },
      ),
    );
  }
}
