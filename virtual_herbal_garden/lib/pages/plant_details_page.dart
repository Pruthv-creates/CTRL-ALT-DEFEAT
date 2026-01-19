import 'package:flutter/material.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import 'package:virtual_herbal_garden/models/plant.dart';

class PlantDetailsPage extends StatelessWidget {
  final Plant plant;

  const PlantDetailsPage({super.key, required this.plant});

  Widget _buildList(String title, List<String> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        ...items.map((item) => Text("• $item")),
        const SizedBox(height: 12),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(plant.commonName),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              plant.botanicalName,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),

            // Images
            SizedBox(
              height: 180,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: plant.images.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 10),
                    child: Image.network(plant.images[index]),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // ✅ 3D Model Viewer
            if (plant.model3D != null)
              SizedBox(
                height: 300,
                child: ModelViewer(
                  backgroundColor: Theme.of(context).colorScheme.inversePrimary,
                  src: plant.model3D!,
                  alt: "${plant.commonName} 3D Model",
                  ar: true,
                  autoRotate: true,
                  cameraControls: true,
                ),
              ),

            const SizedBox(height: 12),

            _buildList("AYUSH Systems", plant.ayushSystems),
            _buildList("Medicinal Properties", plant.medicinalProperties),
            _buildList("Therapeutic Uses", plant.therapeuticUses),
            _buildList("Precautions", plant.precautions),
            _buildList("Disease Categories", plant.diseaseCategories),
            _buildList("Plant Parts Used", plant.plantPartsUsed),
          ],
        ),
      ),
    );
  }
}
