import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../database/services/plant_identification_service.dart';
import '../database/firestore.dart';
import '../models/plant.dart';

class IdentifyPlantScreen extends StatefulWidget {
  const IdentifyPlantScreen({super.key});

  @override
  State<IdentifyPlantScreen> createState() => _IdentifyPlantScreenState();
}

class _IdentifyPlantScreenState extends State<IdentifyPlantScreen> {
  final ImagePicker _picker = ImagePicker();
  final PlantIdentificationService _aiService = PlantIdentificationService();
  final FirestoreService _plantService = FirestoreService();

  bool _loading = false;
  File? _selectedImage;

  Future<void> _pickImage(ImageSource source) async {
    final XFile? image = await _picker.pickImage(source: source);

    if (image == null) return;

    setState(() {
      _loading = true;
      _selectedImage = File(image.path);
    });

    final scientificName =
        await _aiService.identifyPlant(_selectedImage!);

    if (!mounted) return;

    if (scientificName == null) {
      _showError("Plant could not be identified");
      return;
    }

    Plant? plant =
        await _plantService.getPlantByScientificName(scientificName);

    setState(() => _loading = false);

    if (plant == null) {
      _showError("Plant not found in database");
      return;
    }

    Navigator.pushNamed(
      context,
      '/plant_detail',
      arguments: plant.id,
    );
  }

  void _showError(String message) {
    setState(() => _loading = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Identify AYUSH Plant"),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                /// Icon Header
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: colors.primaryContainer,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.eco,
                    size: 48,
                    color: colors.primary,
                  ),
                ),

                const SizedBox(height: 16),

                Text(
                  "Identify Medicinal Plants",
                  style: Theme.of(context).textTheme.titleLarge,
                ),

                const SizedBox(height: 6),

                Text(
                  "Capture or upload a plant image to identify AYUSH plants using AI",
                  textAlign: TextAlign.center,
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: Colors.grey),
                ),

                const SizedBox(height: 24),

                /// Image Preview
                if (_selectedImage != null)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.file(
                      _selectedImage!,
                      height: 180,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),

                const SizedBox(height: 24),

                /// Camera Button
                _actionButton(
                  icon: Icons.camera_alt,
                  label: "Capture from Camera",
                  onTap: () => _pickImage(ImageSource.camera),
                ),

                const SizedBox(height: 14),

                ///Gallery Button
                _actionButton(
                  icon: Icons.photo_library,
                  label: "Upload from Gallery",
                  onTap: () => _pickImage(ImageSource.gallery),
                ),
              ],
            ),
          ),

          /// Loading Overlay
          if (_loading)
            Container(
              color: Colors.black.withValues(alpha: 0.4),
              child: const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 12),
                    Text(
                      "Identifying plant...",
                      style: TextStyle(color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  /// Reusable action button
  Widget _actionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        icon: Icon(icon),
        label: Padding(
          padding: const EdgeInsets.symmetric(vertical: 14),
          child: Text(label),
        ),
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
    );
  }
}
