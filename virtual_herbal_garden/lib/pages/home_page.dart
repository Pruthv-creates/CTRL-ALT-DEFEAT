import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/components/my_drawer.dart';
import 'package:virtual_herbal_garden/screens/seed_data.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with SingleTickerProviderStateMixin {

  late AnimationController _controller;
  late Animation<double> _fade;
  late Animation<Offset> _slide;

  final List<String> themes = [
    'Immunity',
    'Digestion',
    'Respiratory',
    'Stress Relief',
    'Skin Care',
    'Anxiety',
  ];

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _fade = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    );

    _slide = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutCubic,
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      drawer: MyDrawer(),
      appBar: AppBar(
        backgroundColor: colors.primary,
        title: const Text(
          'वन Realm',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.headset_mic_rounded),
            onPressed: () {
              Navigator.pushNamed(context, '/chat_page');
            },
          ),
        ],
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: FadeTransition(
          opacity: _fade,
          child: SlideTransition(
            position: _slide,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                ///  HERO CARD
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        colors.primaryContainer,
                        colors.secondaryContainer,
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(26),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.eco,
                              size: 38,
                              color: colors.inversePrimary),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              ' वन Realm',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: colors.inversePrimary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        'Discover medicinal plants used in AYUSH systems through interactive visuals, curated knowledge, and guided learning paths.',
                        style: TextStyle(
                          fontSize: 15,
                          height: 1.4,
                          color: colors.inversePrimary.withValues(alpha: 0.9),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 34),

                ///  PRIMARY ACTIONS
                Text(
                  'What would you like to do?',
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 14),

                Row(
                  children: [
                    _animatedFeatureCard(
                      context,
                      icon: Icons.local_florist,
                      title: 'Explore Plants',
                      subtitle: 'Browse the herbal glossary',
                      delay: 0,
                      onTap: () =>
                          Navigator.pushNamed(context, '/explore_plants'),
                    ),
                    _animatedFeatureCard(
                      context,
                      icon: Icons.camera_alt,
                      title: 'Identify Plant',
                      subtitle: 'AI-based recognition',
                      delay: 120,
                      onTap: () =>
                          Navigator.pushNamed(context, '/identify_plant'),
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                Row(
                  children: [
                    _animatedFeatureCard(
                      context,
                      icon: Icons.map,
                      title: 'Guided Tours',
                      subtitle: 'Learn by health themes',
                      delay: 240,
                      onTap: () =>
                          Navigator.pushNamed(context, '/guided_tours'),
                    ),
                    _animatedFeatureCard(
                      context,
                      icon: Icons.bookmark,
                      title: 'Bookmarks',
                      subtitle: 'Saved plants',
                      delay: 360,
                      onTap: () =>
                          Navigator.pushNamed(context, '/bookmarks_page'),
                    ),
                  ],
                ),

                const SizedBox(height: 42),

                /// THEMES
                Text(
                  'Start with a Health Theme',
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                Text(
                  'Curated plant collections for focused learning',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 16),

                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: themes.map((theme) {
                    return ActionChip(
                      elevation: 3,
                      padding:
                          const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      label: Text(theme),
                      backgroundColor: colors.secondaryContainer,
                      labelStyle:
                          TextStyle(color: colors.onSecondaryContainer),
                      onPressed: () {
                        Navigator.pushNamed(
                          context,
                          '/explore_plants',
                          arguments: theme,
                        );
                      },
                    );
                  }).toList(),
                ),

                const SizedBox(height: 36),

                /// ADMIN (VISUALLY SEPARATED)
                Divider(color: colors.outline.withOpacity(0.4)),
                const SizedBox(height: 10),

                Text(
                  'Admin Tools',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 10),

                ElevatedButton.icon(
                  icon: const Icon(Icons.cloud_upload),
                  label: const Text('Seed Plants'),
                  onPressed: () async {
                    await SeedDataService().addPlants();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Plants added to Firestore')),
                    );
                  },
                ),
                const SizedBox(height: 10),
                ElevatedButton.icon(
                  icon: const Icon(Icons.route),
                  label: const Text('Seed Guided Tours'),
                  onPressed: () async {
                    await GuidedTourSeeder().seedGuidedTours();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text("Guided Tours Seeded")),
                    );
                  },
                ),
                const SizedBox(height: 10),
                ElevatedButton.icon(
                  icon: const Icon(Icons.update),
                  label: const Text('Update Descriptions'),
                  onPressed: () async {
                    await DescriptionUpdateService().updatePlantDescriptions();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text("Descriptions updated successfully!")),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  ///Animated Feature Card
  Widget _animatedFeatureCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required int delay,
    required VoidCallback onTap,
  }) {
    final colors = Theme.of(context).colorScheme;

    return Expanded(
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0.85, end: 1),
        duration: Duration(milliseconds: 600 + delay),
        curve: Curves.easeOutBack,
        builder: (context, scale, child) {
          return Transform.scale(scale: scale, child: child);
        },
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap,
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 6),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colors.secondaryContainer,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                Icon(icon,
                    size: 34, color: colors.onSecondaryContainer),
                const SizedBox(height: 10),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  ///  Theme Chip
  Widget _themeChip(BuildContext context, String theme) {
    final colors = Theme.of(context).colorScheme;

    return ActionChip(
      label: Text(theme),
      backgroundColor: colors.secondaryContainer,
      labelStyle: TextStyle(color: colors.onSecondaryContainer),
      onPressed: () {
        Navigator.pushNamed(
          context,
          '/explore_plants',
          arguments: theme,
        );
      },
    );
  }
}
