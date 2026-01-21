import 'package:flutter/material.dart';
import '../database/firestore.dart';
import '../models/plant.dart';
import '../database/services/bookmark_service.dart';

class PlantListScreen extends StatelessWidget {
  final FirestoreService _service = FirestoreService();
  final BookmarkService _bookmarkService = BookmarkService();

  PlantListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(' वन Realm')),
      body: FutureBuilder<List<Plant>>(
        future: _service.getPlants(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final plants = snapshot.data!;

          return StreamBuilder<List<String>>(
            stream: _bookmarkService.bookmarkIdsStream(),
            builder: (context, bookmarkSnapshot) {
              final bookmarks = bookmarkSnapshot.data ?? [];

              return ListView.builder(
                itemCount: plants.length,
                itemBuilder: (context, index) {
                  final plant = plants[index];
                  final isBookmarked = bookmarks.contains(plant.id);

                  return ListTile(
                    leading: Image.network(
                      plant.images.first,
                      width: 50,
                      fit: BoxFit.cover,
                    ),
                    title: Text(plant.commonName),
                    subtitle: Text(plant.botanicalName),

                    /// ⭐ BOOKMARK ICON
                    trailing: IconButton(
                      icon: Icon(
                        isBookmarked
                            ? Icons.bookmark
                            : Icons.bookmark_border,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      onPressed: () async {
                        await _bookmarkService.toggleBookmark(
                          plant.id,
                          isBookmarked,
                        );
                      },
                    ),

                    /// 👉 TAP → DETAILS
                    onTap: () {
                      Navigator.pushNamed(
                        context,
                        '/plant_detail',
                        arguments: plant, // Pass Plant object
                      );
                    },

                    /// 👉 LONG PRESS → QUICK BOOKMARK
                    onLongPress: () async {
                      await _bookmarkService.toggleBookmark(
                        plant.id,
                        isBookmarked,
                      );

                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            isBookmarked
                                ? 'Bookmark removed'
                                : 'Bookmark saved!',
                          ),
                          duration: const Duration(seconds: 1),
                        ),
                      );
                    },
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
