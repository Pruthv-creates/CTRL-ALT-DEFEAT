import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/database/services/bookmark_service.dart';
import 'package:virtual_herbal_garden/models/plant.dart';

class BookmarksPage extends StatelessWidget {
  const BookmarksPage({super.key});

  @override
  Widget build(BuildContext context) {
    final bookmarkService = BookmarkService();

    return Scaffold(
      appBar: AppBar(title: const Text('My Bookmarks')),
      body: StreamBuilder<List<String>>(
        stream: bookmarkService.bookmarkIdsStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final ids = snapshot.data ?? [];

          if (ids.isEmpty) {
            return const Center(
              child: Text('No bookmarks yet'),
            );
          }

          return ListView.builder(
            itemCount: ids.length,
            itemBuilder: (context, index) {
              final plantId = ids[index];

              return FutureBuilder<DocumentSnapshot<Map<String, dynamic>>>(
                future: FirebaseFirestore.instance
                    .collection('plants')
                    .doc(plantId)
                    .get(),
                builder: (context, snap) {
                  if (snap.connectionState == ConnectionState.waiting) {
                    return const SizedBox();
                  }

                  if (!snap.hasData ||
                      !snap.data!.exists ||
                      snap.data!.data() == null) {
                    return const ListTile(
                      title: Text('Plant not found'),
                      subtitle: Text('This bookmark may be outdated'),
                      leading: Icon(Icons.warning_amber_rounded),
                    );
                  }

                  final plant = Plant.fromFirestore(
                    snap.data!.id,
                    snap.data!.data()!,
                  );

                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor:
                          Theme.of(context).colorScheme.primaryContainer,
                      child: const Icon(Icons.local_florist),
                    ),
                    title: Text(plant.commonName),
                    subtitle: Text(plant.botanicalName),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      Navigator.pushNamed(
                        context,
                        '/plant_detail',
                        arguments: plant.id,
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
