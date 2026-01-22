# 🌿 वनRealm - A Forest of Wisdom, Alive in the Digital Realm

A comprehensive digital platform for exploring medicinal plants and traditional AYUSH (Ayurveda, Yoga, Unani, Siddha, Homeopathy) knowledge. Experience an immersive journey through herbal wisdom with interactive 3D models, guided tours, and AI-powered plant recommendations.

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://your-demo-url.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

<img width="1621" height="993" alt="image" src="https://github.com/user-attachments/assets/174fc500-a21e-4a5b-91da-bf1835b91e39" />

---

## ✨ Key Features

- 🌱 **42+ Medicinal Plants** - Comprehensive database with detailed information
- 🎨 **Interactive 3D Models** - Explore plants in 3D using Three.js
- 🎧 **Audio Explanations** - Listen to plant descriptions and pronunciations
- 🗺️ **Guided Tours** - Curated learning paths for Immunity, Digestion, and Stress Relief
- 🤖 **AI Chatbot** - Get personalized plant recommendations powered by Gemini AI
- 🔖 **Bookmarks** - Save your favorite plants for quick access
- 🛒 **Marketplace** - Order plants and herbal products
- 💳 **UPI Payment** - Seamless checkout with QR code generation
- 📱 **Responsive Design** - Works perfectly on all devices

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** - 3D rendering
- **Lucide React** - Icons

### Backend & Services
- **Firebase** - Authentication, Firestore, Storage
- **Google Gemini AI** - Chatbot intelligence

---

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase account** (for backend services)
- **Google AI API key** (for chatbot)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Pruthv-creates/CTRL-ALT-DEFEAT.git
cd CTRL-ALT-DEFEAT/web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `web` directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Create a **Firestore Database**
4. Set up **Storage** for images and audio files
5. Copy your Firebase config to `.env`

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📦 Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 📁 Project Structure

```
web/
├── public/
│   ├── assets/
│   │   ├── images/          # Plant images (42 plants × 2 images)
│   │   ├── audio/           # Plant audio explanations
│   │   └── models/          # 3D plant models (.glb files)
│   └── images/
│       └── tours/           # Tour card images
├── src/
│   ├── components/          # Reusable components
│   │   ├── AudioPlayer.jsx
│   │   ├── BackgroundEffect.jsx
│   │   ├── BookmarkButton.tsx
│   │   ├── Chatbot.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── PlantModel3D.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── ExplorePlants.jsx
│   │   ├── PlantDetail.jsx
│   │   ├── Tours.jsx
│   │   ├── TourDetail.jsx
│   │   ├── Marketplace.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.tsx
│   │   └── Bookmarks.jsx
│   ├── services/           # API services
│   │   └── chatbotService.js
│   ├── firebase.js         # Firebase configuration
│   ├── App.jsx            # Main app component
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── package.json
└── vite.config.js
```

---

## 🎯 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero and featured plants |
| `/explore` | Browse all plants with filters |
| `/plant/:id` | Plant detail page with 3D model |
| `/tours` | Guided tour selection |
| `/tour/:id` | Interactive tour experience |
| `/marketplace` | Shop for plants and products |
| `/cart` | Shopping cart |
| `/checkout` | Payment and order confirmation |
| `/bookmarks` | Saved plants |
| `/login` | User authentication |

---

## 🔥 Firebase Collections

### `plants`
```javascript
{
  id: "tulsi",
  commonName: "Tulsi",
  botanicalName: "Ocimum sanctum",
  categoryTag: "Immunity",
  ayushSystems: ["Ayurveda"],
  description: "...",
  medicinalUses: [...],
  precautions: [...],
  lifeCycle: "..."
}
```

### `Users`
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  bookmarks: ["tulsi", "neem", ...]
}
```

### `orders`
```javascript
{
  orderId: "ORD123456",
  userId: "user_id",
  items: [...],
  total: 1500,
  status: "pending",
  timestamp: "..."
}
```

---

## 🤖 Chatbot Usage

The AI chatbot uses Google's Gemini API to provide intelligent plant recommendations:

```javascript
// Example user queries:
"I have digestion problems"
"Need help with stress and anxiety"
"Looking for immunity boosters"
```

The bot analyzes keywords and recommends relevant plants with their properties and uses.

---

## 🎨 Key Features Explained

### 3D Plant Models
- Interactive rotation and zoom
- 13 plants with 3D models
- Built with React Three Fiber and Drei

### Audio Player
- Custom-built audio player
- Play/pause, volume control
- Progress bar with timestamps
- Professional narration for each plant

### Guided Tours
- Animated path showing progress
- Gray → Green path as you advance
- Beautiful timeline visualization
- 3 themed tours (Immunity, Digestion, Stress Relief)

### Marketplace & Checkout
- Add to cart functionality
- UPI payment integration
- QR code generation
- Order tracking

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill the process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Firebase connection issues
- Verify `.env` file exists and has correct values
- Check Firebase project settings
- Ensure Firestore rules allow read/write

### 3D models not loading
- Check if `.glb` files exist in `public/assets/models/`
- Verify file names match plant IDs

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contributors

- **Pruthv** - Lead Developer

---

## 🙏 Acknowledgments

- Plant images and information from traditional AYUSH sources
- 3D models created using Blender
- Audio narrations for educational purposes
- Google Gemini AI for chatbot intelligence

---

## 📧 Contact

suggestions are welcome

---

**Made with 🌿 for preserving and sharing traditional herbal wisdom**
