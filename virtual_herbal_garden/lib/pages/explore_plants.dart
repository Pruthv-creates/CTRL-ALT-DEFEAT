import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/models/plant.dart';
import 'package:virtual_herbal_garden/database/services/plant_service.dart';
import 'package:virtual_herbal_garden/components/my_plant_card.dart';

class ExplorePlantsPage extends StatefulWidget {
  const ExplorePlantsPage({super.key});

  @override
  State<ExplorePlantsPage> createState() => _ExplorePlantsPageState();
}

class _ExplorePlantsPageState extends State<ExplorePlantsPage> {
  final PlantService _plantService = PlantService();
  bool _initialized = false;
  String searchQuery = '';
  String selectedCategory = 'All';

  final List<String> categories = [
    'All',
    'Immunity',
    'Respiratory',
    'Digestive',
    'Skin',
    'Stress Relief',
  ];

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)?.settings.arguments;
    if (!_initialized && args is String) {
      searchQuery = args.toLowerCase();
      _initialized = true;
    }
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore Plants'),
      ),
      body: Column(
        children: [
          // 🔍 Search Bar
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              decoration: const InputDecoration(
                hintText: 'Search plants',
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (value) {
                setState(() => searchQuery = value.toLowerCase());
              },
            ),
          ),

          // 🏷 Category Filter
          SizedBox(
            height: 45,
            child: ListView.builder(
              
              scrollDirection: Axis.horizontal,
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final cat = categories[index];
                final isSelected = selectedCategory == cat;

                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: ChoiceChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (_) {
                      setState(() => selectedCategory = cat);
                    },
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 10),

          // 🌱 Plant Grid
          Expanded(
            child: StreamBuilder<List<Plant>>(
              stream: _plantService.getPlants(),
              builder: (context, snapshot) {

                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No plants found'));
                }

                final plants = snapshot.data!;

                final filteredPlants = plants.where((plant) {
                  // 🔍 SEARCH FILTER
                  final query = searchQuery.toLowerCase();

                  final matchesSearch =
                      query.isEmpty ||
                      plant.commonName.toLowerCase().contains(query) ||
                      plant.botanicalName.toLowerCase().contains(query) ||
                      plant.therapeuticUses.any(
                        (use) => use.toLowerCase().contains(query),
                      ) ||
                      plant.diseaseCategories.any(
                        (disease) => disease.toLowerCase().contains(query),
                      );

                  // 🏷 CATEGORY FILTER
                  final matchesCategory =
                      selectedCategory == 'All' ||
                      plant.diseaseCategories.contains(selectedCategory);

                  return matchesSearch && matchesCategory;
                }).toList();

                if (filteredPlants.isEmpty) {
                  return const Center(child: Text('No plants match your filters'));
                }

                return GridView.builder(
                  padding: const EdgeInsets.all(12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 0.7,
                  ),
                  itemCount: filteredPlants.length,
                  itemBuilder: (context, index) {
                    return PlantCard(plant: filteredPlants[index]);
                  },
                );
              },
            ),
          ),
        ],
      ),

    );
  }
}
