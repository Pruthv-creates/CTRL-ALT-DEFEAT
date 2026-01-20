// Dietary needs to keywords mapping
export const dietaryNeedsKeywords = {
  'digestive_health': [
    'digestion', 'indigestion', 'constipation', 'bloating', 'stomach',
    'gut', 'stomach pain', 'digestive issues', 'bowel', 'metabolism',
    'acid reflux', 'acidity'
  ],
  'immunity': [
    'immunity', 'immune', 'cold', 'flu', 'fever', 'infection',
    'immune system', 'antioxidant', 'boost immunity', 'strengthen',
    'energy', 'fatigue'
  ],
  'respiratory': [
    'cough', 'respiratory', 'throat', 'asthma', 'bronchitis',
    'congestion', 'breathing', 'lungs', 'wheezing', 'expectorant'
  ],
  'stress_relief': [
    'stress', 'anxiety', 'calm', 'relaxation', 'sleep', 'insomnia',
    'nervous', 'tension', 'depression', 'mood', 'brain', 'mental'
  ],
  'skin_health': [
    'skin', 'acne', 'rash', 'wound', 'burn', 'dermatitis', 'eczema',
    'psoriasis', 'inflammation', 'beauty', 'glow', 'aging'
  ],
  'joint_pain': [
    'joint', 'arthritis', 'pain', 'inflammation', 'rheumatism',
    'muscle', 'soreness', 'mobility', 'stiffness', 'gout'
  ],
  'nausea': [
    'nausea', 'vomiting', 'motion sickness', 'dizzy', 'dizziness',
    'vertigo', 'queasiness', 'sick stomach'
  ],
};

// Map dietary needs to disease categories
export const categoryMap = {
  'digestive_health': ['Digestive', 'Indigestion', 'Constipation', 'Nausea', 'Metabolism'],
  'immunity': ['Immune', 'Antioxidant', 'Infection'],
  'respiratory': ['Respiratory', 'Cough', 'Bronchitis'],
  'stress_relief': ['Stress', 'Sleep', 'Anxiety', 'Nervous'],
  'skin_health': ['Skin', 'Acne', 'Dermatitis', 'Wound'],
  'joint_pain': ['Joint pain', 'Arthritis', 'Inflammation', 'Rheumatism'],
  'nausea': ['Nausea', 'Motion sickness', 'Digestive'],
};

// Chatbot responses
export const chatbotResponses = {
  'greeting': 'Hello! 👋 Welcome to वनRealm. I\'m here to help you find the perfect medicinal plants for your needs.',
  'intro': 'I can help you find plants that support:\n• Digestive health\n• Immunity\n• Respiratory health\n• Stress relief\n• Skin health\n• Joint pain relief\n• Nausea relief\n\nPlease tell me about your health concern or dietary need.',
  'not_understood': 'I didn\'t quite understand that. Could you tell me more about your health concern? For example, are you looking for help with digestion, immunity, stress, skin health, or something else?',
  'found_plants': 'Great! I\'ve found some plants that can help with your concern. Below are the recommended plants:',
  'single_plant': 'Perfect! I recommend this plant:',
  'no_plants': 'I\'m sorry, I couldn\'t find specific plants matching your description. Could you try describing your concern differently?',
  'more_help': 'Would you like to explore another health concern? Just tell me what else you\'d like help with!',
};

// Analyze user input and extract dietary needs
export const analyzeDietaryNeeds = (userInput) => {
  const input = userInput.toLowerCase().trim();
  const foundNeeds = new Set();

  Object.entries(dietaryNeedsKeywords).forEach(([need, keywords]) => {
    keywords.forEach(keyword => {
      if (input.includes(keyword)) {
        foundNeeds.add(need);
      }
    });
  });

  return foundNeeds;
};

// Filter plants based on dietary needs
export const filterPlantsByNeeds = (allPlants, dietaryNeeds) => {
  if (dietaryNeeds.size === 0) return [];

  const relevantPlants = [];

  dietaryNeeds.forEach(need => {
    const categories = categoryMap[need] || [];
    allPlants.forEach(plant => {
      if (!relevantPlants.find(p => p.id === plant.id)) {
        categories.forEach(category => {
          if (plant.diseaseCategories &&
            plant.diseaseCategories.some(cat =>
              cat.toLowerCase().includes(category.toLowerCase())
            )) {
            relevantPlants.push(plant);
          }
        });
      }
    });
  });

  return relevantPlants;
};

// Get medicinal properties description
export const getMedicinalDescription = (plant) => {
  const properties = (plant.medicinalProperties || []).join(', ');
  const uses = (plant.therapeuticUses || []).join(', ');
  return `Properties: ${properties}\n\nUses: ${uses}`;
};

// Format plant recommendation
export const formatPlantRecommendation = (plant) => {
  return `🌿 ${plant.commonName} (${plant.botanicalName})\n\n${getMedicinalDescription(plant)}\n\nPlant parts used: ${(plant.plantPartsUsed || []).join(', ')}`;
};
