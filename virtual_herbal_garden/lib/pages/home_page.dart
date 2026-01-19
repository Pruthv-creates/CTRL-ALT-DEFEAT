import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/theme/dark_mode.dart';
import 'package:virtual_herbal_garden/theme/light_mode.dart';
import 'package:virtual_herbal_garden/components/my_drawer.dart';
import 'package:virtual_herbal_garden/screens/seed_data.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    return Scaffold(
      drawer: MyDrawer(),
      appBar: AppBar(
        title: const Text('Virtual Herbal Garden'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.pushNamed(context, '/profile_page');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Header
            Text(
              'Discover AYUSH Medicinal Plants',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Explore traditional herbal knowledge through interactive learning',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),

            const SizedBox(height: 20),

            /// Search Bar
            TextField(
              decoration: InputDecoration(
                hintText: 'Search plants, diseases, or uses',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: colors.surfaceVariant,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                  ),
              ),
              onSubmitted: (query) {
                if (query.trim().isEmpty) return;

                Navigator.pushNamed(
                context,
                '/explore_plants',
                arguments: query.trim(),
                );
              },
            ),

            const SizedBox(height: 25),

            /// Feature Cards
            Row(
              children: [
                _featureCard(
                  context,
                  icon: Icons.local_florist,
                  title: 'Explore Plants',
                  onTap: () {
                    Navigator.pushNamed(context, '/explore_plants');
                  },
                ),
                _featureCard(
                  context,
                  icon: Icons.map,
                  title: 'Guided Tours',
                  onTap: () {
                    // TODO: add tours route
                  },
                ),
                _featureCard(
                  context,
                  icon: Icons.bookmark,
                  title: 'Bookmarks',
                  onTap: () {
                    // TODO: add bookmarks route
                  },
                ),
              ],
            ),

            const SizedBox(height: 30),

            /// Health Themes
            Text(
              'Browse by Health Theme',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                _themeChip(context, 'Immunity'),
                _themeChip(context, 'Digestion'),
                _themeChip(context, 'Respiratory'),
                _themeChip(context, 'Stress Relief'),
                _themeChip(context, 'Skin Care'),
              ],
            ),
          ElevatedButton(
          onPressed: () async {
          await SeedDataService().addPlants();
          ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Plants added to Firestore')),
    );
  },
  child: Text('Seed Plants (Admin)',style: TextStyle(color: Theme.of(context).colorScheme.inversePrimary),),
),

          ],
        ),
      ),
    );
  }

  /// Feature Card
  Widget _featureCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    final colors = Theme.of(context).colorScheme;

    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 6),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: colors.primaryContainer,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              Icon(icon, size: 32, color: colors.onPrimaryContainer),
              const SizedBox(height: 8),
              Text(
                title,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: colors.onPrimaryContainer,
                      fontWeight: FontWeight.w600,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Theme Chip
  Widget _themeChip(BuildContext context, String theme) {
    final colors = Theme.of(context).colorScheme;

    return ActionChip(
      label: Text(theme),
      backgroundColor: colors.secondaryContainer,
      labelStyle: TextStyle(color: colors.onSecondaryContainer),
      onPressed: () {
        // Later: navigate to filtered plant list page
      },
    );
  }
}
