import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class GuidedToursPage extends StatelessWidget {
  const GuidedToursPage({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Guided Thematic Tours"),
        centerTitle: true,
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: FirebaseFirestore.instance
            .collection('themes')
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return const Center(child: Text("Something went wrong"));
          }

          final themes = snapshot.data!.docs;

          if (themes.isEmpty) {
            return const Center(child: Text("No tours available"));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: themes.length,
            itemBuilder: (context, index) {
              final theme = themes[index];
              final data = theme.data();

              return InkWell(
                borderRadius: BorderRadius.circular(18),
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    '/guided_tour_detail',
                    arguments: theme.id, // ✅ CORRECT
                  );
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: colors.primaryContainer,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        data['title'] ?? 'Untitled',
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        data['description'] ?? '',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          const Icon(Icons.eco, size: 18),
                          const SizedBox(width: 6),
                          Text(
                            "${(data['plants'] as List?)?.length ?? 0} plants",
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
