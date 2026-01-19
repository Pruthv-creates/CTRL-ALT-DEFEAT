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
    'More',
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
          'Virtual Herbal Garden',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
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
        child: FadeTransition(
          opacity: _fade,
          child: SlideTransition(
            position: _slide,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                /// 🌿 HERO CARD
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: colors.primaryContainer,
                    borderRadius: BorderRadius.circular(22),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.eco,
                              size: 36,
                              color: colors.inversePrimary),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'Virtual Herbal Garden',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: colors.inversePrimary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Explore medicinal plants used in AYUSH systems through interactive 2D/3D models, curated knowledge, and guided learning.',
                        style: TextStyle(
                          fontSize: 15,
                          color: colors.inversePrimary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 26),

                /// 🔍 SEARCH
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Search plants, diseases, or uses',
                    prefixIcon: const Icon(Icons.search),
                    filled: true,
                    fillColor: colors.primary,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
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

                const SizedBox(height: 32),

                /// 🚀 FEATURES
                Text(
                  'Explore & Learn',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 14),

                Row(
                  children: [
                    _animatedFeatureCard(
                      context,
                      icon: Icons.local_florist,
                      title: 'Explore Plants',
                      subtitle: '2D / 3D views',
                      delay: 0,
                      onTap: () {
                        Navigator.pushNamed(context, '/explore_plants');
                      },
                    ),
                    _animatedFeatureCard(
                      context,
                      icon: Icons.map,
                      title: 'Guided Tours',
                      subtitle: 'Learn by themes',
                      delay: 120,
                      onTap: () {
                        Navigator.pushNamed(context, '/guided_tours');
                      },
                    ),
                    _animatedFeatureCard(
                      context,
                      icon: Icons.bookmark,
                      title: 'Bookmarks_',
                      subtitle: 'Save & revisit',
                      delay: 240,
                      onTap: () {},
                    ),
                  ],
                ),

                const SizedBox(height: 36),

                /// 🌱 THEMES
                Text(
                  'Start with a Health Theme',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Curated collections of plants for focused learning',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 14),

                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: List.generate(
                    themes.length,
                    (index) => TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0, end: 1),
                      duration:
                          Duration(milliseconds: 400 + index * 120),
                      builder: (context, value, child) {
                        return Opacity(
                          opacity: value,
                          child: Transform.translate(
                            offset: Offset(0, 12 * (1 - value)),
                            child: child,
                          ),
                        );
                      },
                      child: _themeChip(context, themes[index]),
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                /// ⚠️ ADMIN
                ElevatedButton(
                  onPressed: () async {
                    await SeedDataService().addPlants();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Plants added to Firestore')),
                    );
                  },
                  child: const Text('Seed Plants (Admin)'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    await GuidedTourSeeder().seedGuidedTours();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Guided Tours Seeded")),
                    );
                  },
                  child: const Text("Seed Guided Tours (Admin)"),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// 🎴 Animated Feature Card
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

  /// 🌿 Theme Chip
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
