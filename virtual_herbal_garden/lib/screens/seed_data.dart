import 'package:cloud_firestore/cloud_firestore.dart';

class SeedDataService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Future<void> addPlants() async {
    final plants = [
      {
        "commonName": "Ginger",
        "botanicalName": "Zingiber officinale",
        "description": "Ginger is a versatile rhizome known for its warming properties and digestive benefits. Widely used in traditional medicine systems, it helps combat nausea, reduce inflammation, and improve digestion.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Anti-nausea", "Anti-inflammatory", "Digestive stimulant"],
        "therapeuticUses": ["Relieves nausea", "Reduces joint pain", "Improves digestion"],
        "precautions": ["Avoid excessive intake with blood thinners"],
        "diseaseCategories": ["Digestive", "Nausea", "Joint pain", "Inflammation"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/ginger1.jpg", "assets/images/ginger2.jpg"],
          "model3D": "assets/3dModels/ginger.glb"
        }
      },
      {
        "commonName": "Aloe Vera",
        "botanicalName": "Aloe barbadensis miller",
        "description": "Aloe Vera is a succulent plant with cooling and moisturizing properties. Its gel is renowned for soothing burns, improving skin health, and supporting digestive wellness.",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Anti-inflammatory", "Cooling", "Moisturizing"],
        "therapeuticUses": ["Soothes skin burns", "Improves digestion", "Promotes wound healing"],
        "precautions": ["Avoid excessive oral consumption"],
        "diseaseCategories": ["Skin", "Digestive"],
        "plantPartsUsed": ["Gel"],
        "media": {
          "images": ["assets/images/aloe1.jpg", "assets/images/aloe2.jpg"],
          "model3D": "assets/3dModels/aloe.glb"
        }
      },
      {
        "commonName": "Lemon",
        "botanicalName": "Citrus limon",
        "description": "Lemon is a citrus fruit rich in vitamin C and antioxidants. It aids digestion, boosts immunity, and acts as a natural detoxifier, making it essential in wellness practices.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Antioxidant", "Detoxifying", "Digestive"],
        "therapeuticUses": ["Boosts immunity", "Aids digestion", "Prevents scurvy"],
        "precautions": ["Avoid excessive intake if acid sensitive"],
        "diseaseCategories": ["Digestive", "Indigestion", "Nausea", "Immune"],
        "plantPartsUsed": ["Fruit", "Peel"],
        "media": {
          "images": ["assets/images/lemon1.jpg", "assets/images/lemon2.jpg"],
          "model3D": "assets/3dModels/lemon.glb"
        }
      },
      {
        "commonName": "Cucumber",
        "botanicalName": "Cucumis sativus",
        "description": "Cucumber is a cooling vegetable with high water content. It hydrates the body, soothes skin irritation, and helps reduce internal heat and acidity.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Cooling", "Hydrating", "Anti-inflammatory"],
        "therapeuticUses": ["Hydrates body", "Soothes skin", "Reduces acidity"],
        "precautions": ["Avoid excessive consumption if cold-sensitive"],
        "diseaseCategories": ["Digestive", "Acidity", "Skin", "Hydration"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/cucumber1.jpg", "assets/images/cucumber2.jpg"],
          "model3D": "assets/3dModels/cucumber.glb"
        }
      },
      {
        "commonName": "Senna",
        "botanicalName": "Senna alexandrina",
        "description": "Senna is a powerful herbal laxative traditionally used to relieve constipation and cleanse the colon. It acts naturally on the digestive system without harsh side effects.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Laxative", "Detoxifying"],
        "therapeuticUses": ["Relieves constipation", "Cleanses colon"],
        "precautions": ["Do not use long-term; avoid in pregnancy"],
        "diseaseCategories": ["Digestive", "Constipation"],
        "plantPartsUsed": ["Leaves", "Pods"],
        "media": {
          "images": ["assets/images/senna1.jpg", "assets/images/senna2.jpg"],
          "model3D": "assets/3dModels/senna.glb"
        }
      },
      {
        "commonName": "Licorice",
        "botanicalName": "Glycyrrhiza glabra",
        "description": "Licorice root is a sweet herb with remarkable soothing properties. It relieves throat irritation, supports digestion, and has been used in traditional medicine for centuries.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Anti-inflammatory", "Soothing", "Expectorant"],
        "therapeuticUses": ["Soothes throat", "Relieves cough", "Supports digestion"],
        "precautions": ["Avoid excessive intake; may raise blood pressure"],
        "diseaseCategories": ["Respiratory", "Cough", "Digestive"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/licorice1.jpg", "assets/images/licorice2.jpg"],
          "model3D": "assets/3dModels/licorice.glb"
        }
      },
      {
        "commonName": "Rose",
        "botanicalName": "Rosa indica",
        "description": "Rose petals offer cooling and anti-inflammatory benefits. Used in traditional beauty rituals and wellness practices, they reduce stress and promote skin and digestive health.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani", "Homeopathy"],
        "medicinalProperties": ["Anti-inflammatory", "Cooling", "Antioxidant"],
        "therapeuticUses": ["Soothes skin", "Reduces stress", "Improves digestion"],
        "precautions": ["Avoid if allergic"],
        "diseaseCategories": ["Skin", "Stress", "Digestive", "Inflammation"],
        "plantPartsUsed": ["Petals", "Leaves"],
        "media": {
          "images": ["assets/images/rose1.jpg", "assets/images/rose2.jpg"],
          "model3D": "assets/3dModels/rose.glb"
        }
      },
      {
        "commonName": "Nux vomica",
        "botanicalName": "Strychnos nux-vomica",
        "description": "Nux vomica is a potent homeopathic remedy used in microdoses to stimulate digestion and support the nervous system. It is toxic in large amounts and only safe in homeopathic preparations.",
        "ayushSystems": ["Homeopathy"],
        "medicinalProperties": ["Stimulant", "Digestive"],
        "therapeuticUses": ["Improves digestion in microdoses", "Stimulates nervous system"],
        "precautions": ["Highly toxic; only homeopathic use"],
        "diseaseCategories": ["Digestive", "Nervous system", "Toxicity"],
        "plantPartsUsed": ["Seeds"],
        "media": {
          "images": ["assets/images/nuxvomica1.jpg", "assets/images/nuxvomica2.jpg"],
          "model3D": "assets/3dModels/nuxvomica.glb"
        }
      },
      {
        "commonName": "Calendula",
        "botanicalName": "Calendula officinalis",
        "description": "Calendula flowers are prized for their healing properties. They accelerate wound healing, reduce inflammation, and are excellent for treating skin conditions and minor injuries.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Anti-inflammatory", "Antimicrobial", "Healing"],
        "therapeuticUses": ["Promotes wound healing", "Reduces skin inflammation"],
        "precautions": ["Avoid if allergic to daisies"],
        "diseaseCategories": ["Skin", "Wounds", "Inflammation", "Infections"],
        "plantPartsUsed": ["Flowers"],
        "media": {
          "images": ["assets/images/calendula1.jpg", "assets/images/calendula2.jpg"],
          "model3D": "assets/3dModels/calendula.glb"
        }
      },
      {
        "commonName": "Fennel",
        "botanicalName": "Foeniculum vulgare",
        "description": "Fennel seeds are aromatic and carminative, helping to reduce bloating and gas. This gentle herb aids digestion and freshens breath, making it a kitchen staple.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Digestive", "Carminative", "Anti-inflammatory"],
        "therapeuticUses": ["Reduces bloating", "Relieves gas", "Supports digestion"],
        "precautions": ["Avoid in excessive amounts"],
        "diseaseCategories": ["Digestive", "Bloating", "Gas"],
        "plantPartsUsed": ["Seeds"],
        "media": {
          "images": ["assets/images/fennel1.jpg", "assets/images/fennel2.jpg"],
          "model3D": "assets/3dModels/fennel.glb"
        }
      },
      {
        "commonName": "Adathoda",
        "botanicalName": "Adhatoda vasica",
        "description": "Adathoda is a respiratory tonic with bronchodilator properties. It effectively relieves cough and supports overall respiratory health, making it invaluable for lung wellness.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Expectorant", "Bronchodilator", "Anti-inflammatory"],
        "therapeuticUses": ["Relieves cough", "Improves respiratory health"],
        "precautions": ["Avoid in pregnancy"],
        "diseaseCategories": ["Respiratory", "Cough", "Asthma"],
        "plantPartsUsed": ["Leaves"],
        "media": {
          "images": ["assets/images/adathoda1.jpg", "assets/images/adathoda2.jpg"],
          "model3D": "assets/3dModels/adathoda.glb"
        }
      },
      {
        "commonName": "Nilavembu",
        "botanicalName": "Andrographis paniculata",
        "description": "Nilavembu is a bitter herb known for its immunity-boosting and anti-malarial properties. It supports liver function and helps the body fight infections naturally.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Anti-malarial", "Immunity booster", "Digestive"],
        "therapeuticUses": ["Prevents malaria", "Boosts immunity", "Supports liver function"],
        "precautions": ["Avoid excessive consumption"],
        "diseaseCategories": ["Infections", "Immune", "Digestive", "Malaria"],
        "plantPartsUsed": ["Leaves", "Stem"],
        "media": {
          "images": ["assets/images/nilavembu1.jpg", "assets/images/nilavembu2.jpg"],
          "model3D": "assets/3dModels/nilavembu.glb"
        }
      },
      {
        "commonName": "Thuthuvalai",
        "botanicalName": "Solanum trilobatum",
        "description": "Thuthuvalai is a respiratory herb traditionally used to treat cough and asthma. It strengthens the lungs and supports healthy breathing, particularly in warm climates.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Respiratory tonic", "Anti-inflammatory", "Expectorant"],
        "therapeuticUses": ["Treats cough", "Improves lung health"],
        "precautions": ["Avoid if allergic to nightshades"],
        "diseaseCategories": ["Respiratory", "Cough", "Asthma", "Inflammation"],
        "plantPartsUsed": ["Leaves", "Stem"],
        "media": {
          "images": ["assets/images/thuthuvalai1.jpg", "assets/images/thuthuvalai2.jpg"],
          "model3D": "assets/3dModels/thuthuvalai.glb"
        }
      },
      {
        "commonName": "Arnica",
        "botanicalName": "Arnica montana",
        "description": "Arnica is renowned for pain relief and healing. Whether for bruises, muscle soreness, or wounds, arnica accelerates recovery and reduces inflammation naturally.",
        "ayushSystems": ["Homeopathy", "Ayurveda"],
        "medicinalProperties": ["Anti-inflammatory", "Pain relief", "Healing"],
        "therapeuticUses": ["Reduces bruises", "Relieves muscle pain", "Heals wounds"],
        "precautions": ["Do not ingest; topical use only"],
        "diseaseCategories": ["Musculoskeletal", "Pain", "Bruises", "Inflammation"],
        "plantPartsUsed": ["Flowers", "Leaves"],
        "media": {
          "images": ["assets/images/arnica1.jpg", "assets/images/arnica2.jpg"],
          "model3D": "assets/3dModels/arnica.glb"
        }
      },
      {
        "commonName": "Turmeric",
        "botanicalName": "Curcuma longa",
        "description": "Turmeric contains curcumin, a powerful anti-inflammatory compound. It reduces inflammation, supports liver health, and boosts immunity, making it essential in wellness practices.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Anti-inflammatory", "Antioxidant", "Antimicrobial"],
        "therapeuticUses": ["Reduces inflammation", "Supports liver health", "Boosts immunity"],
        "precautions": ["May interact with blood thinners"],
        "diseaseCategories": ["Inflammation", "Digestive", "Immune", "Joint pain"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/turmeric1.jpg", "assets/images/turmeric2.jpg"],
          "model3D": "assets/3dModels/turmeric.glb"
        }
      },
      {
        "commonName": "Ashwagandha",
        "botanicalName": "Withania somnifera",
        "description": "Ashwagandha is an adaptogenic herb that reduces stress and anxiety while enhancing vitality. It promotes quality sleep and supports overall well-being during challenging times.",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Adaptogenic", "Anti-stress", "Immunity booster"],
        "therapeuticUses": ["Reduces stress", "Improves sleep", "Enhances vitality"],
        "precautions": ["Avoid during pregnancy"],
        "diseaseCategories": ["Stress", "Anxiety", "Immune", "Sleep disorders"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/ashwagandha1.jpg", "assets/images/ashwagandha2.jpg"],
          "model3D": "assets/3dModels/ashwagandha.glb"
        }
      },
      {
        "commonName": "Tulsi",
        "botanicalName": "Ocimum sanctum",
        "description": "Tulsi, the sacred basil, is an adaptogenic herb revered for stress relief and immunity. It supports respiratory health and acts as a natural immune enhancer.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Adaptogenic", "Antimicrobial", "Anti-inflammatory"],
        "therapeuticUses": ["Relieves respiratory disorders", "Reduces stress", "Boosts immunity"],
        "precautions": ["May lower blood sugar"],
        "diseaseCategories": ["Respiratory", "Stress", "Immune", "Fever"],
        "plantPartsUsed": ["Leaves"],
        "media": {
          "images": ["assets/images/tulsi1.jpg", "assets/images/tulsi2.jpg"],
          "model3D": "assets/3dModels/tulsi.glb"
        }
      },
      {
        "commonName": "Neem",
        "botanicalName": "Azadirachta indica",
        "description": "Neem is a bitter herb with powerful antibacterial and antifungal properties. It purifies the blood, treats various skin conditions, and supports metabolic health.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Antibacterial", "Antifungal", "Blood purifier"],
        "therapeuticUses": ["Treats skin conditions", "Purifies blood", "Controls diabetes"],
        "precautions": ["Avoid in pregnancy; may affect fertility"],
        "diseaseCategories": ["Skin", "Diabetes", "Infections", "Blood disorders"],
        "plantPartsUsed": ["Leaves", "Bark", "Seeds"],
        "media": {
          "images": ["assets/images/neem1.jpg", "assets/images/neem2.jpg"],
          "model3D": "assets/3dModels/neem.glb"
        }
      },
      {
        "commonName": "Brahmi",
        "botanicalName": "Bacopa monnieri",
        "description": "Brahmi is a nootropic herb that enhances memory and cognitive function. It reduces anxiety and supports mental clarity, making it ideal for students and professionals.",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Nootropic", "Anti-anxiety", "Antioxidant"],
        "therapeuticUses": ["Enhances memory", "Reduces anxiety", "Improves cognitive function"],
        "precautions": ["May cause digestive upset"],
        "diseaseCategories": ["Cognitive disorders", "Anxiety", "Memory loss"],
        "plantPartsUsed": ["Whole plant"],
        "media": {
          "images": ["assets/images/brahmi1.jpg", "assets/images/brahmi2.jpg"],
          "model3D": "assets/3dModels/brahmi.glb"
        }
      },
      {
        "commonName": "Amla",
        "botanicalName": "Phyllanthus emblica",
        "description": "Amla is rich in vitamin C and antioxidants. It boosts immunity, improves digestion, and promotes hair growth, making it a rejuvenating superfruit in Ayurveda.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Antioxidant", "Vitamin C rich", "Rejuvenating"],
        "therapeuticUses": ["Boosts immunity", "Improves digestion", "Promotes hair growth"],
        "precautions": ["May lower blood sugar"],
        "diseaseCategories": ["Immune", "Digestive", "Hair loss", "Aging"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/amla1.jpg", "assets/images/amla2.jpg"],
          "model3D": "assets/3dModels/amla.glb"
        }
      },
      {
        "commonName": "Triphala",
        "botanicalName": "Terminalia chebula, Terminalia bellirica, Emblica officinalis",
        "description": "Triphala is a classical Ayurvedic formula combining three fruits. It gently cleanses the colon, improves digestion, and supports overall vitality.",
        "ayushSystems": ["Ayurveda"],
        "medicinalProperties": ["Digestive", "Detoxifying", "Antioxidant"],
        "therapeuticUses": ["Improves digestion", "Cleanses colon", "Supports eye health"],
        "precautions": ["May cause loose stools initially"],
        "diseaseCategories": ["Digestive", "Constipation", "Detoxification"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/triphala1.jpg", "assets/images/triphala2.jpg"],
          "model3D": "assets/3dModels/triphala.glb"
        }
      },
      {
        "commonName": "Haritaki",
        "botanicalName": "Terminalia chebula",
        "description": "Haritaki is a rejuvenating fruit that supports digestion and natural detoxification. Known as the king of herbs in Ayurveda, it promotes overall wellness.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Laxative", "Rejuvenating", "Antioxidant"],
        "therapeuticUses": ["Relieves constipation", "Improves digestion", "Detoxifies body"],
        "precautions": ["Avoid in pregnancy"],
        "diseaseCategories": ["Digestive", "Constipation", "Detoxification"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/haritaki1.jpg", "assets/images/haritaki2.jpg"],
          "model3D": "assets/3dModels/haritaki.glb"
        }
      },
      {
        "commonName": "Guggul",
        "botanicalName": "Commiphora wightii",
        "description": "Guggul resin is known for managing cholesterol and supporting weight loss. It reduces inflammation and supports joint health, making it valuable for metabolic wellness.",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Anti-inflammatory", "Cholesterol-lowering", "Weight management"],
        "therapeuticUses": ["Reduces cholesterol", "Supports weight loss", "Treats arthritis"],
        "precautions": ["May interact with medications"],
        "diseaseCategories": ["Cardiovascular", "Obesity", "Arthritis", "Cholesterol"],
        "plantPartsUsed": ["Resin"],
        "media": {
          "images": ["assets/images/guggul1.jpg", "assets/images/guggul2.jpg"],
          "model3D": "assets/3dModels/guggul.glb"
        }
      },
      {
        "commonName": "Shatavari",
        "botanicalName": "Asparagus racemosus",
        "description": "Shatavari means 'she who has a hundred husbands.' This rejuvenating herb supports reproductive health, hormonal balance, and lactation in women.",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Rejuvenating", "Hormonal balance", "Galactagogue"],
        "therapeuticUses": ["Supports reproductive health", "Balances hormones", "Increases lactation"],
        "precautions": ["Avoid if allergic to asparagus"],
        "diseaseCategories": ["Reproductive health", "Hormonal imbalance", "Lactation"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/shatavari1.jpg", "assets/images/shatavari2.jpg"],
          "model3D": "assets/3dModels/shatavari.glb"
        }
      },
      {
        "commonName": "Guduchi",
        "botanicalName": "Tinospora cordifolia",
        "description": "Guduchi is an immunomodulator that strengthens immunity and fights chronic infections. It reduces fever and supports recovery from various health conditions.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Immunomodulator", "Anti-inflammatory", "Antipyretic"],
        "therapeuticUses": ["Boosts immunity", "Reduces fever", "Treats chronic infections"],
        "precautions": ["May lower blood sugar"],
        "diseaseCategories": ["Immune", "Fever", "Infections", "Diabetes"],
        "plantPartsUsed": ["Stem"],
        "media": {
          "images": ["assets/images/guduchi1.jpg", "assets/images/guduchi2.jpg"],
          "model3D": "assets/3dModels/guduchi.glb"
        }
      },
      {
        "commonName": "Bhringraj",
        "botanicalName": "Eclipta alba",
        "description": "Bhringraj means 'king of herbs for hair.' It promotes hair growth, supports liver health, and enhances memory, making it prized in traditional beauty care.",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Hair tonic", "Hepatoprotective", "Memory enhancer"],
        "therapeuticUses": ["Promotes hair growth", "Supports liver health", "Improves memory"],
        "precautions": ["May cause allergic reactions"],
        "diseaseCategories": ["Hair loss", "Liver disorders", "Memory loss"],
        "plantPartsUsed": ["Leaves"],
        "media": {
          "images": ["assets/images/bhringraj1.jpg", "assets/images/bhringraj2.jpg"],
          "model3D": "assets/3dModels/bhringraj.glb"
        }
      },
      {
        "commonName": "Punarnava",
        "botanicalName": "Boerhavia diffusa",
        "description": "Punarnava means 'renewal.' This diuretic herb supports kidney health, reduces edema, and promotes cardiovascular wellness through natural detoxification.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Diuretic", "Anti-inflammatory", "Rejuvenating"],
        "therapeuticUses": ["Treats kidney disorders", "Reduces edema", "Supports heart health"],
        "precautions": ["Avoid in pregnancy"],
        "diseaseCategories": ["Kidney disorders", "Edema", "Cardiovascular"],
        "plantPartsUsed": ["Root", "Whole plant"],
        "media": {
          "images": ["assets/images/punarnava1.jpg", "assets/images/punarnava2.jpg"],
          "model3D": "assets/3dModels/punarnava.glb"
        }
      },
      {
        "commonName": "Shankhpushpi",
        "botanicalName": "Convolvulus pluricaulis",
        "description": "Shankhpushpi is a nootropic herb that enhances memory and mental clarity. It reduces anxiety and promotes restful sleep, supporting cognitive wellness.",
        "ayushSystems": ["Ayurveda"],
        "medicinalProperties": ["Nootropic", "Anti-anxiety", "Sedative"],
        "therapeuticUses": ["Enhances memory", "Reduces stress", "Improves sleep"],
        "precautions": ["May cause drowsiness"],
        "diseaseCategories": ["Cognitive disorders", "Anxiety", "Insomnia", "Stress"],
        "plantPartsUsed": ["Whole plant"],
        "media": {
          "images": ["assets/images/shankhpushpi1.jpg", "assets/images/shankhpushpi2.jpg"],
          "model3D": "assets/3dModels/shankhpushpi.glb"
        }
      },
      {
        "commonName": "Manjistha",
        "botanicalName": "Rubia cordifolia",
        "description": "Manjistha is a blood purifier with powerful antimicrobial properties. It treats skin conditions, heals wounds, and supports overall skin radiance.",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Blood purifier", "Anti-inflammatory", "Antimicrobial"],
        "therapeuticUses": ["Treats skin diseases", "Purifies blood", "Heals wounds"],
        "precautions": ["May cause urine discoloration"],
        "diseaseCategories": ["Skin", "Blood disorders", "Wounds"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/manjistha1.jpg", "assets/images/manjistha2.jpg"],
          "model3D": "assets/3dModels/manjistha.glb"
        }
      },
      {
        "commonName": "Vidanga",
        "botanicalName": "Embelia ribes",
        "description": "Vidanga is an anthelmintic herb that eliminates intestinal parasites naturally. It improves digestion and supports skin health through internal cleansing.",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Anthelmintic", "Digestive", "Antimicrobial"],
        "therapeuticUses": ["Removes intestinal worms", "Improves digestion", "Treats skin diseases"],
        "precautions": ["Avoid in pregnancy"],
        "diseaseCategories": ["Digestive", "Parasitic infections", "Skin"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/vidanga1.jpg", "assets/images/vidanga2.jpg"],
          "model3D": "assets/3dModels/vidanga.glb"
        }
      },
      {
        "commonName": "Kutki",
        "botanicalName": "Picrorhiza kurroa",
        "description": "Kutki is a hepatoprotective herb that supports liver health and treats jaundice. It enhances immunity and supports digestive wellness.",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Hepatoprotective", "Anti-inflammatory", "Immune booster"],
        "therapeuticUses": ["Supports liver health", "Treats jaundice", "Boosts immunity"],
        "precautions": ["May cause digestive upset"],
        "diseaseCategories": ["Liver disorders", "Jaundice", "Immune"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/kutki1.jpg", "assets/images/kutki2.jpg"],
          "model3D": "assets/3dModels/kutki.glb"
        }
      },
      {
        "commonName": "Pippali",
        "botanicalName": "Piper longum",
        "description": "Pippali, long pepper, enhances digestive fire and bioavailability of nutrients. It supports respiratory health and acts as a natural bioenhancer.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Digestive", "Respiratory tonic", "Bioenhancer"],
        "therapeuticUses": ["Treats respiratory disorders", "Improves digestion", "Enhances absorption"],
        "precautions": ["Avoid in high pitta conditions"],
        "diseaseCategories": ["Respiratory", "Digestive", "Cough"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/pippali1.jpg", "assets/images/pippali2.jpg"],
          "model3D": "assets/3dModels/pippali.glb"
        }
      },
      {
        "commonName": "Bala",
        "botanicalName": "Sida cordifolia",
        "description": "Bala means 'strength.' This rejuvenating herb strengthens muscles, improves stamina, and supports nervous system health through natural vitalization.",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Rejuvenating", "Anti-inflammatory", "Nervine tonic"],
        "therapeuticUses": ["Strengthens muscles", "Improves stamina", "Treats nervous disorders"],
        "precautions": ["May interact with stimulants"],
        "diseaseCategories": ["Musculoskeletal", "Nervous disorders", "Fatigue"],
        "plantPartsUsed": ["Root", "Whole plant"],
        "media": {
          "images": ["assets/images/bala1.jpg", "assets/images/bala2.jpg"],
          "model3D": "assets/3dModels/bala.glb"
        }
      },
      {
        "commonName": "Jatamansi",
        "botanicalName": "Nardostachys jatamansi",
        "description": "Jatamansi is a sedative herb that reduces stress and promotes quality sleep. It enhances memory and supports emotional well-being through calming effects.",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Sedative", "Anti-anxiety", "Neuroprotective"],
        "therapeuticUses": ["Reduces stress", "Improves sleep", "Enhances memory"],
        "precautions": ["May cause drowsiness"],
        "diseaseCategories": ["Anxiety", "Insomnia", "Stress", "Cognitive disorders"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/jatamansi1.jpg", "assets/images/jatamansi2.jpg"],
          "model3D": "assets/3dModels/jatamansi.glb"
        }
      },
      {
        "commonName": "Yashtimadhu",
        "botanicalName": "Glycyrrhiza glabra",
        "description": "Yashtimadhu, also called licorice, soothes the throat and treats peptic ulcers. Its demulcent properties support respiratory and digestive wellness.",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Demulcent", "Expectorant", "Anti-inflammatory"],
        "therapeuticUses": ["Soothes throat", "Treats peptic ulcers", "Relieves cough"],
        "precautions": ["May raise blood pressure with long-term use"],
        "diseaseCategories": ["Respiratory", "Digestive", "Ulcers"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/yashtimadhu1.jpg", "assets/images/yashtimadhu2.jpg"],
          "model3D": "assets/3dModels/yashtimadhu.glb"
        }
      },
      {
        "commonName": "Vacha",
        "botanicalName": "Acorus calamus",
        "description": "Vacha enhances memory and supports clear speech. This nootropic herb has been used traditionally to improve cognitive function and mental clarity.",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Nootropic", "Anti-epileptic", "Digestive"],
        "therapeuticUses": ["Enhances memory", "Treats epilepsy", "Improves speech"],
        "precautions": ["Avoid in pregnancy; may be carcinogenic in high doses"],
        "diseaseCategories": ["Cognitive disorders", "Epilepsy", "Speech disorders"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/vacha1.jpg", "assets/images/vacha2.jpg"],
          "model3D": "assets/3dModels/vacha.glb"
        }
      },  
      {
        "commonName": "Nux vomica",
        "botanicalName": "Strychnos nux-vomica",
        "ayushSystems": ["Homeopathy"],
        "medicinalProperties": ["Stimulant", "Digestive"],
        "therapeuticUses": ["Improves digestion in microdoses", "Stimulates nervous system"],
        "precautions": ["Highly toxic; only homeopathic use"],
        "diseaseCategories": ["Digestive", "Nervous system", "Toxicity"],
        "plantPartsUsed": ["Seeds"],
        "media": {
          "images": ["assets/images/nuxvomica1.jpg", "assets/images/nuxvomica2.jpg"],
          "model3D": "assets/3dModels/nuxvomica.glb"
        }
      },
      {
        "commonName": "Calendula",
        "botanicalName": "Calendula officinalis",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Anti-inflammatory", "Antimicrobial", "Healing"],
        "therapeuticUses": ["Promotes wound healing", "Reduces skin inflammation"],
        "precautions": ["Avoid if allergic to daisies"],
        "diseaseCategories": ["Skin", "Wounds", "Inflammation", "Infections"],
        "plantPartsUsed": ["Flowers"],
        "media": {
          "images": ["assets/images/calendula1.jpg", "assets/images/calendula2.jpg"],
          "model3D": "assets/3dModels/calendula.glb"
        }
      },
      {
        "commonName": "Fennel",
        "botanicalName": "Foeniculum vulgare",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Digestive", "Carminative", "Anti-inflammatory"],
        "therapeuticUses": ["Reduces bloating", "Relieves gas", "Supports digestion"],
        "precautions": ["Avoid in excessive amounts"],
        "diseaseCategories": ["Digestive", "Bloating", "Gas"],
        "plantPartsUsed": ["Seeds"],
        "media": {
          "images": ["assets/images/fennel1.jpg", "assets/images/fennel2.jpg"],
          "model3D": "assets/3dModels/fennel.glb"
        }
      },
      {
        "commonName": "Adathoda",
        "botanicalName": "Adhatoda vasica",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Expectorant", "Bronchodilator", "Anti-inflammatory"],
        "therapeuticUses": ["Relieves cough", "Improves respiratory health"],
        "precautions": ["Avoid in pregnancy"],
        "diseaseCategories": ["Respiratory", "Cough", "Asthma"],
        "plantPartsUsed": ["Leaves"],
        "media": {
          "images": ["assets/images/adathoda1.jpg", "assets/images/adathoda2.jpg"],
          "model3D": "assets/3dModels/adathoda.glb"
        }
      },
      {
        "commonName": "Nilavembu",
        "botanicalName": "Andrographis paniculata",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Anti-malarial", "Immunity booster", "Digestive"],
        "therapeuticUses": ["Prevents malaria", "Boosts immunity", "Supports liver function"],
        "precautions": ["Avoid excessive consumption"],
        "diseaseCategories": ["Infections", "Immune", "Digestive", "Malaria"],
        "plantPartsUsed": ["Leaves", "Stem"],
        "media": {
          "images": ["assets/images/nilavembu1.jpg", "assets/images/nilavembu2.jpg"],
          "model3D": "assets/3dModels/nilavembu.glb"
        }
      },
      {
        "commonName": "Thuthuvalai",
        "botanicalName": "Solanum trilobatum",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Respiratory tonic", "Anti-inflammatory", "Expectorant"],
        "therapeuticUses": ["Treats cough", "Improves lung health"],
        "precautions": ["Avoid if allergic to nightshades"],
        "diseaseCategories": ["Respiratory", "Cough", "Asthma", "Inflammation"],
        "plantPartsUsed": ["Leaves", "Stem"],
        "media": {
          "images": ["assets/images/thuthuvalai1.jpg", "assets/images/thuthuvalai2.jpg"],
          "model3D": "assets/3dModels/thuthuvalai.glb"
        }
      },
      {
        "commonName": "Arnica",
        "botanicalName": "Arnica montana",
        "ayushSystems": ["Homeopathy", "Ayurveda"],
        "medicinalProperties": ["Anti-inflammatory", "Pain relief", "Healing"],
        "therapeuticUses": ["Reduces bruises", "Relieves muscle pain", "Heals wounds"],
        "precautions": ["Do not ingest; topical use only"],
        "diseaseCategories": ["Musculoskeletal", "Pain", "Bruises", "Inflammation"],
        "plantPartsUsed": ["Flowers", "Leaves"],
        "media": {
          "images": ["assets/images/arnica1.jpg", "assets/images/arnica2.jpg"],
          "model3D": "assets/3dModels/arnica.glb"
        }
      },
      {
        "commonName": "Turmeric",
        "botanicalName": "Curcuma longa",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Anti-inflammatory", "Antioxidant", "Antimicrobial"],
        "therapeuticUses": ["Reduces inflammation", "Supports liver health", "Boosts immunity"],
        "precautions": ["May interact with blood thinners"],
        "diseaseCategories": ["Inflammation", "Digestive", "Immune", "Joint pain"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/turmeric1.jpg", "assets/images/turmeric2.jpg"],
          "model3D": "assets/3dModels/turmeric.glb"
        }
      },
      {
        "commonName": "Ashwagandha",
        "botanicalName": "Withania somnifera",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Adaptogenic", "Anti-stress", "Immunity booster"],
        "therapeuticUses": ["Reduces stress", "Improves sleep", "Enhances vitality"],
        "precautions": ["Avoid during pregnancy"],
        "diseaseCategories": ["Stress", "Anxiety", "Immune", "Sleep disorders"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/ashwagandha1.jpg", "assets/images/ashwagandha2.jpg"],
          "model3D": "assets/3dModels/ashwagandha.glb"
        }
      },
      {
        "commonName": "Tulsi",
        "botanicalName": "Ocimum sanctum",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Adaptogenic", "Antimicrobial", "Anti-inflammatory"],
        "therapeuticUses": ["Relieves respiratory disorders", "Reduces stress", "Boosts immunity"],
        "precautions": ["May lower blood sugar"],
        "diseaseCategories": ["Respiratory", "Stress", "Immune", "Fever"],
        "plantPartsUsed": ["Leaves"],
        "media": {
          "images": ["assets/images/tulsi1.jpg", "assets/images/tulsi2.jpg"],
          "model3D": "assets/3dModels/tulsi.glb"
        }
      },
      {
        "commonName": "Neem",
        "botanicalName": "Azadirachta indica",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Antibacterial", "Antifungal", "Blood purifier"],
        "therapeuticUses": ["Treats skin conditions", "Purifies blood", "Controls diabetes"],
        "precautions": ["Avoid in pregnancy; may affect fertility"],
        "diseaseCategories": ["Skin", "Diabetes", "Infections", "Blood disorders"],
        "plantPartsUsed": ["Leaves", "Bark", "Seeds"],
        "media": {
          "images": ["assets/images/neem1.jpg", "assets/images/neem2.jpg"],
          "model3D": "assets/3dModels/neem.glb"
        }
      },
      {
        "commonName": "Brahmi",
        "botanicalName": "Bacopa monnieri",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Nootropic", "Anti-anxiety", "Antioxidant"],
        "therapeuticUses": ["Enhances memory", "Reduces anxiety", "Improves cognitive function"],
        "precautions": ["May cause digestive upset"],
        "diseaseCategories": ["Cognitive disorders", "Anxiety", "Memory loss"],
        "plantPartsUsed": ["Whole plant"],
        "media": {
          "images": ["assets/images/brahmi1.jpg", "assets/images/brahmi2.jpg"],
          "model3D": "assets/3dModels/brahmi.glb"
        }
      },
      {
        "commonName": "Amla",
        "botanicalName": "Phyllanthus emblica",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Antioxidant", "Vitamin C rich", "Rejuvenating"],
        "therapeuticUses": ["Boosts immunity", "Improves digestion", "Promotes hair growth"],
        "precautions": ["May lower blood sugar"],
        "diseaseCategories": ["Immune", "Digestive", "Hair loss", "Aging"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/amla1.jpg", "assets/images/amla2.jpg"],
          "model3D": "assets/3dModels/amla.glb"
        }
      },
      {
        "commonName": "Triphala",
        "botanicalName": "Terminalia chebula, Terminalia bellirica, Emblica officinalis",
        "ayushSystems": ["Ayurveda"],
        "medicinalProperties": ["Digestive", "Detoxifying", "Antioxidant"],
        "therapeuticUses": ["Improves digestion", "Cleanses colon", "Supports eye health"],
        "precautions": ["May cause loose stools initially"],
        "diseaseCategories": ["Digestive", "Constipation", "Detoxification"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/triphala1.jpg", "assets/images/triphala2.jpg"],
          "model3D": "assets/3dModels/triphala.glb"
        }
      },
      {
        "commonName": "Haritaki",
        "botanicalName": "Terminalia chebula",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Laxative", "Rejuvenating", "Antioxidant"],
        "therapeuticUses": ["Relieves constipation", "Improves digestion", "Detoxifies body"],
        "precautions": ["Avoid in pregnancy"],
        "diseaseCategories": ["Digestive", "Constipation", "Detoxification"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/haritaki1.jpg", "assets/images/haritaki2.jpg"],
          "model3D": "assets/3dModels/haritaki.glb"
        }
      },
      {
        "commonName": "Guggul",
        "botanicalName": "Commiphora wightii",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Anti-inflammatory", "Cholesterol-lowering", "Weight management"],
        "therapeuticUses": ["Reduces cholesterol", "Supports weight loss", "Treats arthritis"],
        "precautions": ["May interact with medications"],
        "diseaseCategories": ["Cardiovascular", "Obesity", "Arthritis", "Cholesterol"],
        "plantPartsUsed": ["Resin"],
        "media": {
          "images": ["assets/images/guggul1.jpg", "assets/images/guggul2.jpg"],
          "model3D": "assets/3dModels/guggul.glb"
        }
      },
      {
        "commonName": "Shatavari",
        "botanicalName": "Asparagus racemosus",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Rejuvenating", "Hormonal balance", "Galactagogue"],
        "therapeuticUses": ["Supports reproductive health", "Balances hormones", "Increases lactation"],
        "precautions": ["Avoid if allergic to asparagus"],
        "diseaseCategories": ["Reproductive health", "Hormonal imbalance", "Lactation"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/shatavari1.jpg", "assets/images/shatavari2.jpg"],
          "model3D": "assets/3dModels/shatavari.glb"
        }
      },
      {
        "commonName": "Guduchi",
        "botanicalName": "Tinospora cordifolia",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Immunomodulator", "Anti-inflammatory", "Antipyretic"],
        "therapeuticUses": ["Boosts immunity", "Reduces fever", "Treats chronic infections"],
        "precautions": ["May lower blood sugar"],
        "diseaseCategories": ["Immune", "Fever", "Infections", "Diabetes"],
        "plantPartsUsed": ["Stem"],
        "media": {
          "images": ["assets/images/guduchi1.jpg", "assets/images/guduchi2.jpg"],
          "model3D": "assets/3dModels/guduchi.glb"
        }
      },
      {
        "commonName": "Bhringraj",
        "botanicalName": "Eclipta alba",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Hair tonic", "Hepatoprotective", "Memory enhancer"],
        "therapeuticUses": ["Promotes hair growth", "Supports liver health", "Improves memory"],
        "precautions": ["May cause allergic reactions"],
        "diseaseCategories": ["Hair loss", "Liver disorders", "Memory loss"],
        "plantPartsUsed": ["Leaves"],
        "media": {
          "images": ["assets/images/bhringraj1.jpg", "assets/images/bhringraj2.jpg"],
          "model3D": "assets/3dModels/bhringraj.glb"
        }
      },
      {
        "commonName": "Punarnava",
        "botanicalName": "Boerhavia diffusa",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Diuretic", "Anti-inflammatory", "Rejuvenating"],
        "therapeuticUses": ["Treats kidney disorders", "Reduces edema", "Supports heart health"],
        "precautions": ["Avoid in pregnancy"],
        "diseaseCategories": ["Kidney disorders", "Edema", "Cardiovascular"],
        "plantPartsUsed": ["Root", "Whole plant"],
        "media": {
          "images": ["assets/images/punarnava1.jpg", "assets/images/punarnava2.jpg"],
          "model3D": "assets/3dModels/punarnava.glb"
        }
      },
      {
        "commonName": "Shankhpushpi",
        "botanicalName": "Convolvulus pluricaulis",
        "ayushSystems": ["Ayurveda"],
        "medicinalProperties": ["Nootropic", "Anti-anxiety", "Sedative"],
        "therapeuticUses": ["Enhances memory", "Reduces stress", "Improves sleep"],
        "precautions": ["May cause drowsiness"],
        "diseaseCategories": ["Cognitive disorders", "Anxiety", "Insomnia", "Stress"],
        "plantPartsUsed": ["Whole plant"],
        "media": {
          "images": ["assets/images/shankhpushpi1.jpg", "assets/images/shankhpushpi2.jpg"],
          "model3D": "assets/3dModels/shankhpushpi.glb"
        }
      },
      {
        "commonName": "Manjistha",
        "botanicalName": "Rubia cordifolia",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Blood purifier", "Anti-inflammatory", "Antimicrobial"],
        "therapeuticUses": ["Treats skin diseases", "Purifies blood", "Heals wounds"],
        "precautions": ["May cause urine discoloration"],
        "diseaseCategories": ["Skin", "Blood disorders", "Wounds"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/manjistha1.jpg", "assets/images/manjistha2.jpg"],
          "model3D": "assets/3dModels/manjistha.glb"
        }
      },
      {
        "commonName": "Vidanga",
        "botanicalName": "Embelia ribes",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Anthelmintic", "Digestive", "Antimicrobial"],
        "therapeuticUses": ["Removes intestinal worms", "Improves digestion", "Treats skin diseases"],
        "precautions": ["Avoid in pregnancy"],
        "diseaseCategories": ["Digestive", "Parasitic infections", "Skin"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/vidanga1.jpg", "assets/images/vidanga2.jpg"],
          "model3D": "assets/3dModels/vidanga.glb"
        }
      },
      {
        "commonName": "Kutki",
        "botanicalName": "Picrorhiza kurroa",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Hepatoprotective", "Anti-inflammatory", "Immune booster"],
        "therapeuticUses": ["Supports liver health", "Treats jaundice", "Boosts immunity"],
        "precautions": ["May cause digestive upset"],
        "diseaseCategories": ["Liver disorders", "Jaundice", "Immune"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/kutki1.jpg", "assets/images/kutki2.jpg"],
          "model3D": "assets/3dModels/kutki.glb"
        }
      },
      {
        "commonName": "Pippali",
        "botanicalName": "Piper longum",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Digestive", "Respiratory tonic", "Bioenhancer"],
        "therapeuticUses": ["Treats respiratory disorders", "Improves digestion", "Enhances absorption"],
        "precautions": ["Avoid in high pitta conditions"],
        "diseaseCategories": ["Respiratory", "Digestive", "Cough"],
        "plantPartsUsed": ["Fruit"],
        "media": {
          "images": ["assets/images/pippali1.jpg", "assets/images/pippali2.jpg"],
          "model3D": "assets/3dModels/pippali.glb"
        }
      },
      {
        "commonName": "Bala",
        "botanicalName": "Sida cordifolia",
        "ayushSystems": ["Ayurveda", "Siddha"],
        "medicinalProperties": ["Rejuvenating", "Anti-inflammatory", "Nervine tonic"],
        "therapeuticUses": ["Strengthens muscles", "Improves stamina", "Treats nervous disorders"],
        "precautions": ["May interact with stimulants"],
        "diseaseCategories": ["Musculoskeletal", "Nervous disorders", "Fatigue"],
        "plantPartsUsed": ["Root", "Whole plant"],
        "media": {
          "images": ["assets/images/bala1.jpg", "assets/images/bala2.jpg"],
          "model3D": "assets/3dModels/bala.glb"
        }
      },
      {
        "commonName": "Jatamansi",
        "botanicalName": "Nardostachys jatamansi",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Sedative", "Anti-anxiety", "Neuroprotective"],
        "therapeuticUses": ["Reduces stress", "Improves sleep", "Enhances memory"],
        "precautions": ["May cause drowsiness"],
        "diseaseCategories": ["Anxiety", "Insomnia", "Stress", "Cognitive disorders"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/jatamansi1.jpg", "assets/images/jatamansi2.jpg"],
          "model3D": "assets/3dModels/jatamansi.glb"
        }
      },
      {
        "commonName": "Yashtimadhu",
        "botanicalName": "Glycyrrhiza glabra",
        "ayushSystems": ["Ayurveda", "Siddha", "Unani"],
        "medicinalProperties": ["Demulcent", "Expectorant", "Anti-inflammatory"],
        "therapeuticUses": ["Soothes throat", "Treats peptic ulcers", "Relieves cough"],
        "precautions": ["May raise blood pressure with long-term use"],
        "diseaseCategories": ["Respiratory", "Digestive", "Ulcers"],
        "plantPartsUsed": ["Root"],
        "media": {
          "images": ["assets/images/yashtimadhu1.jpg", "assets/images/yashtimadhu2.jpg"],
          "model3D": "assets/3dModels/yashtimadhu.glb"
        }
      },
      {
        "commonName": "Vacha",
        "botanicalName": "Acorus calamus",
        "ayushSystems": ["Ayurveda", "Unani"],
        "medicinalProperties": ["Nootropic", "Anti-epileptic", "Digestive"],
        "therapeuticUses": ["Enhances memory", "Treats epilepsy", "Improves speech"],
        "precautions": ["Avoid in pregnancy; may be carcinogenic in high doses"],
        "diseaseCategories": ["Cognitive disorders", "Epilepsy", "Speech disorders"],
        "plantPartsUsed": ["Rhizome"],
        "media": {
          "images": ["assets/images/vacha1.jpg", "assets/images/vacha2.jpg"],
          "model3D": "assets/3dModels/vacha.glb"
        }
      }
    ];
    for (final plant in plants) {
      final clean = Map<String, dynamic>.from(plant);

      final id = plant['commonName']
          .toString()
          .toLowerCase()
          .replaceAll(' ', '_');

      await _db.collection('plants').doc(id).set(clean);
    }
  }
}

class DescriptionUpdateService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Map of plant names to descriptions
  final Map<String, String> _descriptions = {
    "Ginger": "Ginger is a versatile rhizome known for its warming properties and digestive benefits. Widely used in traditional medicine systems, it helps combat nausea, reduce inflammation, and improve digestion.",
    "Aloe Vera": "Aloe Vera is a succulent plant with cooling and moisturizing properties. Its gel is renowned for soothing burns, improving skin health, and supporting digestive wellness.",
    "Lemon": "Lemon is a citrus fruit rich in vitamin C and antioxidants. It aids digestion, boosts immunity, and acts as a natural detoxifier, making it essential in wellness practices.",
    "Cucumber": "Cucumber is a cooling vegetable with high water content. It hydrates the body, soothes skin irritation, and helps reduce internal heat and acidity.",
    "Senna": "Senna is a powerful herbal laxative traditionally used to relieve constipation and cleanse the colon. It acts naturally on the digestive system without harsh side effects.",
    "Licorice": "Licorice root is a sweet herb with remarkable soothing properties. It relieves throat irritation, supports digestion, and has been used in traditional medicine for centuries.",
    "Rose": "Rose petals offer cooling and anti-inflammatory benefits. Used in traditional beauty rituals and wellness practices, they reduce stress and promote skin and digestive health.",
    "Nux vomica": "Nux vomica is a potent homeopathic remedy used in microdoses to stimulate digestion and support the nervous system. It is toxic in large amounts and only safe in homeopathic preparations.",
    "Calendula": "Calendula flowers are prized for their healing properties. They accelerate wound healing, reduce inflammation, and are excellent for treating skin conditions and minor injuries.",
    "Fennel": "Fennel seeds are aromatic and carminative, helping to reduce bloating and gas. This gentle herb aids digestion and freshens breath, making it a kitchen staple.",
    "Adathoda": "Adathoda is a respiratory tonic with bronchodilator properties. It effectively relieves cough and supports overall respiratory health, making it invaluable for lung wellness.",
    "Nilavembu": "Nilavembu is a bitter herb known for its immunity-boosting and anti-malarial properties. It supports liver function and helps the body fight infections naturally.",
    "Thuthuvalai": "Thuthuvalai is a respiratory herb traditionally used to treat cough and asthma. It strengthens the lungs and supports healthy breathing, particularly in warm climates.",
    "Arnica": "Arnica is renowned for pain relief and healing. Whether for bruises, muscle soreness, or wounds, arnica accelerates recovery and reduces inflammation naturally.",
    "Turmeric": "Turmeric contains curcumin, a powerful anti-inflammatory compound. It reduces inflammation, supports liver health, and boosts immunity, making it essential in wellness practices.",
    "Ashwagandha": "Ashwagandha is an adaptogenic herb that reduces stress and anxiety while enhancing vitality. It promotes quality sleep and supports overall well-being during challenging times.",
    "Tulsi": "Tulsi, the sacred basil, is an adaptogenic herb revered for stress relief and immunity. It supports respiratory health and acts as a natural immune enhancer.",
    "Neem": "Neem is a bitter herb with powerful antibacterial and antifungal properties. It purifies the blood, treats various skin conditions, and supports metabolic health.",
    "Brahmi": "Brahmi is a nootropic herb that enhances memory and cognitive function. It reduces anxiety and supports mental clarity, making it ideal for students and professionals.",
    "Amla": "Amla is rich in vitamin C and antioxidants. It boosts immunity, improves digestion, and promotes hair growth, making it a rejuvenating superfruit in Ayurveda.",
    "Triphala": "Triphala is a classical Ayurvedic formula combining three fruits. It gently cleanses the colon, improves digestion, and supports overall vitality.",
    "Haritaki": "Haritaki is a rejuvenating fruit that supports digestion and natural detoxification. Known as the king of herbs in Ayurveda, it promotes overall wellness.",
    "Guggul": "Guggul resin is known for managing cholesterol and supporting weight loss. It reduces inflammation and supports joint health, making it valuable for metabolic wellness.",
    "Shatavari": "Shatavari means 'she who has a hundred husbands.' This rejuvenating herb supports reproductive health, hormonal balance, and lactation in women.",
    "Guduchi": "Guduchi is an immunomodulator that strengthens immunity and fights chronic infections. It reduces fever and supports recovery from various health conditions.",
    "Bhringraj": "Bhringraj means 'king of herbs for hair.' It promotes hair growth, supports liver health, and enhances memory, making it prized in traditional beauty care.",
    "Punarnava": "Punarnava means 'renewal.' This diuretic herb supports kidney health, reduces edema, and promotes cardiovascular wellness through natural detoxification.",
    "Shankhpushpi": "Shankhpushpi is a nootropic herb that enhances memory and mental clarity. It reduces anxiety and promotes restful sleep, supporting cognitive wellness.",
    "Manjistha": "Manjistha is a blood purifier with powerful antimicrobial properties. It treats skin conditions, heals wounds, and supports overall skin radiance.",
    "Vidanga": "Vidanga is an anthelmintic herb that eliminates intestinal parasites naturally. It improves digestion and supports skin health through internal cleansing.",
    "Kutki": "Kutki is a hepatoprotective herb that supports liver health and treats jaundice. It enhances immunity and supports digestive wellness.",
    "Pippali": "Pippali, long pepper, enhances digestive fire and bioavailability of nutrients. It supports respiratory health and acts as a natural bioenhancer.",
    "Bala": "Bala means 'strength.' This rejuvenating herb strengthens muscles, improves stamina, and supports nervous system health through natural vitalization.",
    "Jatamansi": "Jatamansi is a sedative herb that reduces stress and promotes quality sleep. It enhances memory and supports emotional well-being through calming effects.",
    "Yashtimadhu": "Yashtimadhu, also called licorice, soothes the throat and treats peptic ulcers. Its demulcent properties support respiratory and digestive wellness.",
    "Vacha": "Vacha enhances memory and supports clear speech. This nootropic herb has been used traditionally to improve cognitive function and mental clarity.",
  };

  Future<void> updatePlantDescriptions() async {
    try {
      for (final plantName in _descriptions.keys) {
        final plantId = plantName.toLowerCase().replaceAll(' ', '_');
        final description = _descriptions[plantName];

        await _db.collection('plants').doc(plantId).update({
          'description': description,
        });

        print('Updated description for: $plantName');
      }
      print('✓ All descriptions updated successfully!');
    } catch (e) {
      print('Error updating descriptions: $e');
    }
  }
}

class GuidedTourSeeder {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<void> seedGuidedTours() async {
    // 1️⃣ Load all plants and build name → id map
    final plantSnap = await _firestore.collection('plants').get();

    final Map<String, String> plantNameToId = {
      for (final doc in plantSnap.docs)
        (doc.data()['commonName'] as String): doc.id,
    };

    // 2️⃣ Original tours (names only)
    final tours = {
      "immunity": {
        "title": "Immunity Booster",
        "description": "Plants that strengthen immunity and fight infections",
        "plants": [
          "Tulsi",
          "Amla",
          "Turmeric",
          "Guduchi",
          "Ashwagandha",
          "Nilavembu",
          "Lemon",
          "Kutki"
        ],
      },
      "digestion": {
        "title": "Digestive Health",
        "description": "Herbs that improve digestion and detoxification",
        "plants": [
          "Ginger",
          "Fennel",
          "Triphala",
          "Haritaki",
          "Senna",
          "Aloe Vera",
          "Lemon",
          "Vidanga",
          "Pippali"
        ],
      },
      "respiratory": {
        "title": "Respiratory Care",
        "description": "Plants for cough, asthma, and lung health",
        "plants": [
          "Tulsi",
          "Adathoda",
          "Thuthuvalai",
          "Yashtimadhu",
          "Pippali",
          "Ginger"
        ],
      },
      "mental_health": {
        "title": "Stress, Sleep & Mind",
        "description": "Herbs for mental wellness and cognitive support",
        "plants": [
          "Ashwagandha",
          "Brahmi",
          "Shankhpushpi",
          "Jatamansi",
          "Nux vomica",
          "Rose"
        ],
      },
      "skin_care": {
        "title": "Skin & Wound Healing",
        "description": "Plants that heal skin and reduce inflammation",
        "plants": [
          "Neem",
          "Aloe Vera",
          "Calendula",
          "Manjistha",
          "Arnica",
          "Rose"
        ],
      },
      "pain_inflammation": {
        "title": "Pain & Inflammation Relief",
        "description": "Herbs for joint pain and inflammation",
        "plants": [
          "Turmeric",
          "Guggul",
          "Arnica",
          "Ginger",
          "Bala"
        ],
      },
      "womens_health": {
        "title": "Women’s & Hormonal Health",
        "description": "Plants supporting reproductive and hormonal balance",
        "plants": [
          "Shatavari",
          "Ashwagandha",
          "Bala",
          "Punarnava"
        ],
      },
    };

    // 3️⃣ Seed themes using PLANT IDS
    for (final entry in tours.entries) {
      final List<String> plantIds = [];

      for (final name in entry.value["plants"] as List<String>) {
        final id = plantNameToId[name];
        if (id != null) {
          plantIds.add(id);
        } else {
          print("Warning: Plant name '$name' not found in database.");
        }
      }

      await _firestore.collection("themes").doc(entry.key).set({
        "title": entry.value["title"],
        "description": entry.value["description"],
        "plants": plantIds,
        "createdAt": FieldValue.serverTimestamp(),
      });
    }
  }
}