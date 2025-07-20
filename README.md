# 🚿 Did You Shower Today?

A quirky, interactive dashboard that visualizes the correlation between shower frequency and mental stability, energy, and general vibes. Built with React, TypeScript, and beautiful animations.

## ✨ Features

### 🎨 **Professional UI/UX**
- **Dark/Light Mode Toggle** - Smooth theme switching with persistent preferences
- **Bilingual Support** - English/French with smooth language transitions
- **Responsive Design** - Beautiful on all devices with proper spacing
- **Glass Morphism** - Modern glass effects with backdrop blur
- **Smooth Animations** - Framer Motion powered micro-interactions

### 📊 **Interactive Charts**
- **Line Chart** - Weekly shower frequency vs mental state correlation
- **Bar Chart** - Vibe levels by day with color-coded mood indicators
- **Pie Chart** - Shower product usage breakdown
- **Custom Tooltips** - Animated tooltips with vibe descriptions
- **Hover Effects** - Interactive chart elements with smooth transitions

### 🎯 **Interactive Elements**
- **Group Selector** - Switch between Students, Remote Workers, and Office Workers
- **Language Toggle** - EN/FR switching with animated indicators
- **Theme Switcher** - Dark/Light mode with smooth transitions
- **Animated Stats** - Real-time calculated statistics with hover effects

### 🌟 **Fun Features**
- **Vibe Descriptions** - "Smelled decent", "Crisis mode", "One with the universe"
- **Floating Animations** - Subtle background animations (🧼, 🚿, 🧠, ☁️)
- **Synthetic Data** - Clearly marked fictional data for educational purposes
- **Mood Indicators** - Color-coded bars based on vibe levels

### 🔐 **Authentication System**
- **Real Firebase Auth** - Secure email/password authentication
- **User Profiles** - Personal dashboard with achievements and stats
- **Data Persistence** - Shower data and achievements saved to Firestore
- **Demo Mode** - Works without Firebase setup for testing

## 🛠️ Technical Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety and better developer experience
- **Framer Motion** - Smooth animations and micro-interactions
- **Recharts** - Beautiful, responsive chart library
- **Lucide React** - Modern icon library
- **Firebase** - Authentication and Firestore database
- **CSS Variables** - Dynamic theming system

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shower
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase (Required for Authentication)**
   
   **Option A: Quick Setup (Demo Mode)**
   - The app will work with demo authentication (any email/password)
   - Perfect for testing and development
   
   **Option B: Real Firebase Setup**
   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Create a Firebase project and enable Authentication + Firestore
   - Update `src/firebase/config.ts` with your Firebase credentials

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop** - Full feature set with side-by-side charts
- **Tablet** - Stacked layout with maintained functionality
- **Mobile** - Optimized touch interactions and readable text

## 🎨 Design Principles

### **3Cs Applied**
- **Context** - Clear titles and descriptions for each chart
- **Clutter-Free** - Clean, spacious layout with focused information
- **Contrast** - Proper color contrast and visual hierarchy

### **Accessibility**
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - Proper ARIA labels and semantic HTML
- **Color Blindness** - Color-safe palette with additional indicators
- **Focus Management** - Clear focus indicators and logical tab order

## 📊 Data Structure

### **Synthetic Data Disclaimer**
This dashboard uses clearly marked synthetic data for educational visualization purposes. The correlations shown are fictional and meant to demonstrate interactive data visualization techniques.

### **Data Types**
- **Shower Frequency** - Daily shower count (0-1 scale)
- **Vibe Level** - Mental state score (0-10 scale)
- **Product Usage** - Shampoo, body wash, both, or none
- **Group Categories** - Students, Remote Workers, Office Workers

## 🌍 Internationalization

- **English/French** - Complete translation support
- **Dynamic Content** - All UI elements, chart labels, and tooltips
- **Smooth Transitions** - Animated language switching
- **Cultural Considerations** - Appropriate date formats and number formatting

## 🎯 Assignment Requirements Met

✅ **2 Different Chart Types** - Line chart and Bar chart  
✅ **Language Toggle** - EN/FR with smooth transitions  
✅ **Interactive Elements** - Group selector, theme switcher, hover effects  
✅ **Professional UI** - Modern, clean design with proper spacing  
✅ **Synthetic Data** - Clearly marked fictional data  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Accessibility** - Keyboard navigation and screen reader support  

## 🚀 Deployment

The dashboard is ready for deployment to any static hosting service:

```bash
npm run build
```

## 📝 License

This project is created for educational purposes as part of a UI/UX course assignment.

---

**Built with ❤️ and lots of shower thoughts** 🚿✨
