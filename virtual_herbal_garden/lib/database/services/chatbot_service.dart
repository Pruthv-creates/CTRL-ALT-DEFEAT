import 'package:virtual_herbal_garden/models/plant.dart';

class ChatbotMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;
  final Plant? plant;

  ChatbotMessage({
    required this.text,
    required this.isUser,
    required this.timestamp,
    this.plant,
  });
}

class ChatbotService {
  // Dietary needs to keywords mapping
  static const Map<String, List<String>> dietaryNeedsKeywords = {
    'digestive_health': [
      'digestion',
      'indigestion',
      'constipation',
      'bloating',
      'stomach',
      'gut',
      'stomach pain',
      'digestive issues',
      'bowel',
      'metabolism'
    ],
    'immunity': [
      'immunity',
      'immune',
      'cold',
      'flu',
      'fever',
      'infection',
      'immune system',
      'antioxidant',
      'boost immunity',
      'strengthen'
    ],
    'respiratory': [
      'cough',
      'respiratory',
      'throat',
      'asthma',
      'bronchitis',
      'congestion',
      'breathing',
      'lungs',
      'wheezing',
      'expectorant'
    ],
    'stress_relief': [
      'stress',
      'anxiety',
      'calm',
      'relaxation',
      'sleep',
      'insomnia',
      'nervous',
      'tension',
      'depression',
      'mood'
    ],
    'skin_health': [
      'skin',
      'acne',
      'rash',
      'wound',
      'burn',
      'dermatitis',
      'eczema',
      'psoriasis',
      'inflammation',
      'beauty'
    ],
    'joint_pain': [
      'joint',
      'arthritis',
      'pain',
      'inflammation',
      'rheumatism',
      'muscle',
      'soreness',
      'mobility',
      'stiffness',
      'gout'
    ],
    'nausea': [
      'nausea',
      'vomiting',
      'motion sickness',
      'dizzy',
      'dizziness',
      'vertigo',
      'queasiness',
      'sick stomach'
    ],
  };

  // Chatbot responses
  static const Map<String, String> chatbotResponses = {
    'greeting': 'Hello! 👋 Welcome to the Virtual Herbal Garden Chatbot. I\'m here to help you find the perfect medicinal plants for your dietary needs. What health concerns or dietary needs would you like to address today?',
    'intro': 'I can help you find plants that support:\n• Digestive health\n• Immunity\n• Respiratory health\n• Stress relief\n• Skin health\n• Joint pain relief\n• Nausea relief\n\nPlease tell me about your health concern or dietary need.',
    'not_understood': 'I didn\'t quite understand that. Could you tell me more about your health concern? For example, are you looking for help with digestion, immunity, stress, skin health, or something else?',
    'found_plants': 'Great! I\'ve found some plants that can help with your concern. Below are the recommended plants:',
    'single_plant': 'Perfect! I recommend this plant:',
    'no_plants': 'I\'m sorry, I couldn\'t find specific plants matching your description. Could you try describing your concern differently?',
    'more_help': 'Would you like to explore another health concern? Just tell me what else you\'d like help with!',
  };

  // Get initial greeting message
  static ChatbotMessage getGreeting() {
    return ChatbotMessage(
      text: chatbotResponses['greeting']!,
      isUser: false,
      timestamp: DateTime.now(),
    );
  }

  // Analyze user input and extract dietary needs
  static Set<String> analyzeDietaryNeeds(String userInput) {
    final input = userInput.toLowerCase().trim();
    final foundNeeds = <String>{};

    dietaryNeedsKeywords.forEach((need, keywords) {
      for (final keyword in keywords) {
        if (input.contains(keyword)) {
          foundNeeds.add(need);
        }
      }
    });

    return foundNeeds;
  }

  // Get response based on dietary needs
  static ChatbotMessage getResponseMessage(String userInput) {
    final needs = analyzeDietaryNeeds(userInput);

    if (needs.isEmpty) {
      return ChatbotMessage(
        text: chatbotResponses['not_understood']!,
        isUser: false,
        timestamp: DateTime.now(),
      );
    }

    final response = chatbotResponses['found_plants']!;
    return ChatbotMessage(
      text: response,
      isUser: false,
      timestamp: DateTime.now(),
    );
  }

  // Filter plants based on dietary needs
  static List<Plant> filterPlantsByNeeds(
    List<Plant> allPlants,
    Set<String> dietaryNeeds,
  ) {
    if (dietaryNeeds.isEmpty) return [];

    // Map dietary needs to disease categories
    final categoryMap = {
      'digestive_health': ['Digestive', 'Indigestion', 'Constipation', 'Nausea', 'Metabolism'],
      'immunity': ['Immune', 'Antioxidant', 'Infection'],
      'respiratory': ['Respiratory', 'Cough', 'Bronchitis'],
      'stress_relief': ['Stress', 'Sleep', 'Anxiety', 'Nervous'],
      'skin_health': ['Skin', 'Acne', 'Dermatitis', 'Wound'],
      'joint_pain': ['Joint pain', 'Arthritis', 'Inflammation', 'Rheumatism'],
      'nausea': ['Nausea', 'Motion sickness', 'Digestive'],
    };

    final relevantPlants = <Plant>{};

    for (final need in dietaryNeeds) {
      final categories = categoryMap[need] ?? [];
      for (final plant in allPlants) {
        for (final category in categories) {
          if (plant.diseaseCategories.any(
            (cat) => cat.toLowerCase().contains(category.toLowerCase()),
          )) {
            relevantPlants.add(plant);
          }
        }
      }
    }

    return relevantPlants.toList();
  }

  // Get medicinal properties description
  static String getMedicinalDescription(Plant plant) {
    final properties = plant.medicinalProperties.join(', ');
    final uses = plant.therapeuticUses.join(', ');
    return 'Properties: $properties\n\nUses: $uses';
  }

  // Format plant recommendation
  static String formatPlantRecommendation(Plant plant) {
    return '🌿 ${plant.commonName} (${plant.botanicalName})\n\n${getMedicinalDescription(plant)}\n\nPlant parts used: ${plant.plantPartsUsed.join(', ')}';
  }
}
