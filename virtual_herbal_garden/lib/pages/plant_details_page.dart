import 'package:flutter/material.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import 'package:virtual_herbal_garden/models/plant.dart';
import '../database/services/bookmark_service.dart';
import '../database/services/cart_service.dart';

class PlantDetailsPage extends StatefulWidget {
  final Plant plant;

  const PlantDetailsPage({super.key, required this.plant});

  @override
  State<PlantDetailsPage> createState() => _PlantDetailsPageState();
}

class _PlantDetailsPageState extends State<PlantDetailsPage> {
  final BookmarkService _bookmarkService = BookmarkService();
  final CartService _cartService = CartService();

  Widget _buildList(String title, List<String> items) {
    if (items.isEmpty) return const SizedBox();

    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: const TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 6),
          ...items.map((item) => Text("• $item")),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

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
                  isBookmarked
                      ? Icons.bookmark
                      : Icons.bookmark_border,
                ),
                onPressed: () {
                  _bookmarkService.toggleBookmark(
                    widget.plant.id,
                    isBookmarked,
                  );
                },
              ),
            ],
          ),

          ///  ADD TO CART BUTTON (STICKY)
          bottomNavigationBar: Padding(
            padding: const EdgeInsets.all(18),
            child: ElevatedButton.icon(
              icon: const Icon(Icons.shopping_cart),
              label: const Text("Add to Cart"),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              onPressed: () async {
                await _cartService.addToCart(widget.plant.id);

                if (!mounted) return;

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Added to cart")),
                );
              },
            ),
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
                const SizedBox(height: 14),

                ///  IMAGES
                if (widget.plant.images.isNotEmpty)
                  SizedBox(
                    height: 180,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: widget.plant.images.length,
                      separatorBuilder: (_, __) =>
                          const SizedBox(width: 10),
                      itemBuilder: (context, index) {
                        return ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: Image.asset(
                            widget.plant.images[index],
                            width: 220,
                            fit: BoxFit.cover,
                          ),
                        );
                      },
                    ),
                  ),

                const SizedBox(height: 20),

                ///  3D MODEL
                if (widget.plant.model3D != null)
                  SizedBox(
                    height: 300,
                    child: ModelViewer(
                      backgroundColor: colors.inverseSurface,
                      src: widget.plant.model3D!,
                      alt: "${widget.plant.commonName} 3D Model",
                      ar: true,
                      autoRotate: true,
                      cameraControls: true,
                    ),
                  ),

                const SizedBox(height: 20),

                ///  DETAILS CARD
                Card(
                  elevation: 8,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                        children: [
                          Row(
                            children: [
                              _buildList("AYUSH Systems", widget.plant.ayushSystems),
                              Expanded(child: SizedBox())
                            ],
                          ),
                          Row(
                            children: [
                              _buildList("Medicinal Properties", widget.plant.medicinalProperties),
                              Expanded(child: SizedBox())
                            ],
                          ),
                          Row(
                            children: [
                              _buildList("Therapeutic Uses", widget.plant.therapeuticUses),
                              Expanded(child: SizedBox())
                            ],
                          ),
                          Row(
                            children: [
                              _buildList("Precautions", widget.plant.precautions),
                              Expanded(child: SizedBox())
                            ],
                          ),
                          Row(
                            children: [
                              _buildList("Disease Categories", widget.plant.diseaseCategories),
                              Expanded(child: SizedBox())
                            ],
                          ),
                          Row(
                            children: [
                              _buildList("Plant Parts Used", widget.plant.plantPartsUsed),
                              Expanded(child: SizedBox())
                            ],
                          ),
                        ],
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
