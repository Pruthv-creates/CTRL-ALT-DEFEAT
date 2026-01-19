import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class GuidedTourDetailPage extends StatefulWidget {
  const GuidedTourDetailPage({super.key});

  @override
  State<GuidedTourDetailPage> createState() => _GuidedTourDetailPageState();
}

class _GuidedTourDetailPageState extends State<GuidedTourDetailPage> {
  final ScrollController _scrollController = ScrollController();
  double _scrollOffset = 0;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      setState(() {
        _scrollOffset = _scrollController.offset;
      });
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final String tourId =
        ModalRoute.of(context)!.settings.arguments as String;

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
            return const Center(
              child: Text("Tour not found"),
            );
          }

          final data = snapshot.data!.data()!;
          final title = data['title'] ?? 'Untitled';
          final description = data['description'] ?? '';

          final plantsRaw = data['plants'] ?? [];
          final plants = plantsRaw.map((p) {
            if (p is String) return p;
            if (p is DocumentReference) return p.id;
            if (p is Map && p.containsKey('commonName')) return p['commonName'];
            return p.toString();
          }).toList();

          return Padding(
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
                const SizedBox(height: 10),
                Text(description),
                const SizedBox(height: 20),
                const Text(
                  "Plants in this tour",
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),

                // Scrollable list of animated plant tiles
                Expanded(
                  child: ListView.builder(
                    controller: _scrollController,
                    itemCount: plants.length,
                    itemBuilder: (context, index) {
                      // Calculate how "focused" the tile is
                      double position = index * 100 - _scrollOffset;
                      double scale = 1.0 - (position.abs() / 600);
                      scale = scale.clamp(0.8, 1.0);

                      return GestureDetector(
                        onTap: () {
                          // Navigate to plant detail page (replace with your route)
                          Navigator.pushNamed(
                            context,
                            '/plant_detail',
                            arguments: plants[index],
                          );
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeOut,
                          margin: const EdgeInsets.symmetric(vertical: 8),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.primaryContainer,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 8,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          transform: Matrix4.identity()..scale(scale, scale),
                          child: Row(
                            children: [
                              const Icon(Icons.eco, size: 32),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Text(
                                  plants[index],
                                  style: TextStyle(
                                    fontSize: 18 * scale,
                                    fontWeight: FontWeight.w600,
                                  ),
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
            ),
          );
        },
      ),
    );
  }
}
