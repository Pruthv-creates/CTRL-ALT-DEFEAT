import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/models/plant.dart';
import 'package:virtual_herbal_garden/pages/plant_details_page.dart';

class GuidedTourDetailPage extends StatelessWidget {
  const GuidedTourDetailPage({super.key});

  /// Normalize plant IDs safely
  List<String> _extractPlantIds(List raw) {
    return raw.map<String>((p) {
      if (p is String) return p;
      if (p is DocumentReference) return p.id;
      return '';
    }).where((id) => id.isNotEmpty).toList();
  }

  @override
  Widget build(BuildContext context) {
    final String tourId =
        ModalRoute.of(context)!.settings.arguments as String;

    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text("Guided Tour")),
      body: FutureBuilder<DocumentSnapshot<Map<String, dynamic>>>(
        future: FirebaseFirestore.instance
            .collection('themes')
            .doc(tourId)
            .get(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || !snapshot.data!.exists) {
            return const Center(child: Text("Tour not found"));
          }

          final data = snapshot.data!.data()!;
          final title = data['title'] ?? 'Untitled';
          final description = data['description'] ?? '';
          final plantIds = _extractPlantIds(data['plants'] ?? []);

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              /// Header
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context)
                          .textTheme
                          .titleLarge
                          ?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(description),
                    const SizedBox(height: 20),
                    const Text(
                      "Plants in this tour",
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),

              /// Plant list
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: plantIds.length,
                  itemBuilder: (context, index) {
                    final plantId = plantIds[index];

                    return InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () async {
                        final snap = await FirebaseFirestore.instance
                            .collection('plants')
                            .doc(plantId)
                            .get();

                        if (!snap.exists || snap.data() == null) return;

                        final plant =
                            Plant.fromFirestore(snap.id, snap.data()!);

                        if (!context.mounted) return;

                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                PlantDetailsPage(plant: plant),
                          ),
                        );
                      },
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: colors.primaryContainer,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.08),
                              blurRadius: 10,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.eco, size: 32),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                plantId.replaceAll('_', ' ').toUpperCase(),
                                style: Theme.of(context)
                                    .textTheme
                                    .titleMedium
                                    ?.copyWith(fontWeight: FontWeight.w600),
                              ),
                            ),
                            const Icon(Icons.arrow_forward_ios, size: 18),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
