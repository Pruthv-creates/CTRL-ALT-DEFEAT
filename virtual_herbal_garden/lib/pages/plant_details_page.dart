import 'package:flutter/material.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import 'package:virtual_herbal_garden/models/plant.dart';
import '../database/services/bookmark_service.dart';

class PlantDetailsPage extends StatefulWidget {
  final Plant plant;

  const PlantDetailsPage({super.key, required this.plant});

  @override
  State<PlantDetailsPage> createState() => _PlantDetailsPageState();
}

class _PlantDetailsPageState extends State<PlantDetailsPage> {
  final BookmarkService _bookmarkService = BookmarkService();

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
    return StreamBuilder<List<String>>(
      stream: _bookmarkService.bookmarkIdsStream(),
      builder: (context, snapshot) {
        final bookmarks = snapshot.data ?? [];
        final isBookmarked = bookmarks.contains(widget.plant.id);

        return Scaffold(
          appBar: AppBar(
            title: Text(widget.plant.commonName),
            actions: [
              IconButton(
                icon: Icon(
                  isBookmarked ? Icons.bookmark : Icons.bookmark_border,
                ),
                onPressed: () {
                  _bookmarkService.toggleBookmark(
                    widget.plant.id,
                    isBookmarked,
                  );
                },
              )
            ],
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.plant.botanicalName,
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
                    itemCount: widget.plant.images.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 10),
                        child: Image.network(widget.plant.images[index]),
                      );
                    },
                  ),
                ),

                const SizedBox(height: 16),

                // 3D Model
                if (widget.plant.model3D != null)
                  SizedBox(
                    height: 300,
                    child: ModelViewer(
                      backgroundColor:
                          Theme.of(context).colorScheme.inverseSurface,
                      src: widget.plant.model3D!,
                      alt: "${widget.plant.commonName} 3D Model",
                      ar: true,
                      autoRotate: true,
                      cameraControls: true,
                    ),
                  ),

                const SizedBox(height: 12),

                Center(
                  child: Card(
                    elevation: 10,
                    color: Theme.of(context).colorScheme.surface,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        children: [
                          _buildList("AYUSH Systems", widget.plant.ayushSystems),
                          _buildList("Medicinal Properties", widget.plant.medicinalProperties),
                          _buildList("Therapeutic Uses", widget.plant.therapeuticUses),
                          _buildList("Precautions", widget.plant.precautions),
                          _buildList("Disease Categories", widget.plant.diseaseCategories),
                          _buildList("Plant Parts Used", widget.plant.plantPartsUsed),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
