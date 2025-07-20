import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  en: {
    title: "Did You Shower Today?",
    subtitle: "A quirky interactive dashboard that visualizes the correlation between shower frequency and mental stability, energy, and general vibes.",
    weeklyShowers: "Weekly Shower Frequency",
    mentalState: "Mental State Score",
    vibeLevel: "Vibe Level by Day",
    shampooUsage: "Shower Product Usage",
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    shampoo: "Shampoo",
    bodyWash: "Body Wash",
    both: "Both",
    none: "None",
    smelledDecent: "Smelled decent",
    crisisMode: "Crisis mode",
    oneWithUniverse: "One with the universe",
    deadInside: "Dead inside",
    selectGroup: "Select Group",
    students: "Students",
    remoteWorkers: "Remote Workers",
    officeWorkers: "Office Workers",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    weeklyShowersLabel: "Weekly Showers",
    avgVibeLevel: "Avg Vibe Level",
    peakDays: "Peak Days",
    lineChartDescription: "This line chart shows the correlation between daily shower frequency and mental state scores throughout the week. Notice how shower frequency (blue line) and mental well-being (green line) often follow similar patterns.",
    barChartDescription: "This bar chart displays daily vibe levels with color-coded bars. Green bars indicate high vibes (8-10), blue for good vibes (6-7), orange for medium vibes (4-5), and red for low vibes (0-3).",
    pieChartDescription: "This pie chart shows the distribution of shower product usage. It reveals preferences between shampoo, body wash, using both, or skipping products entirely.",
    heroTitle: "Discover Your Shower Patterns",
    heroSubtitle: "Explore the fascinating correlation between shower frequency and mental well-being. See how your daily routine affects your vibe levels and overall energy.",
    disclaimerNote: "Note",
    disclaimerText: "This dashboard uses synthetic data for demonstration purposes. The correlations shown are fictional and meant for educational visualization."
  },
  fr: {
    title: "As-tu pris une douche aujourd'hui?",
    subtitle: "Un tableau de bord interactif qui visualise la corrélation entre la fréquence des douches et la stabilité mentale, l'énergie et les bonnes vibes.",
    weeklyShowers: "Fréquence hebdomadaire des douches",
    mentalState: "Score de l'état mental",
    vibeLevel: "Niveau de vibe par jour",
    shampooUsage: "Utilisation des produits de douche",
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi", 
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",
    shampoo: "Shampooing",
    bodyWash: "Gel douche",
    both: "Les deux",
    none: "Aucun",
    smelledDecent: "Sentait décent",
    crisisMode: "Mode crise",
    oneWithUniverse: "Un avec l'univers",
    deadInside: "Mort à l'intérieur",
    selectGroup: "Sélectionner un groupe",
    students: "Étudiants",
    remoteWorkers: "Travailleurs à distance",
    officeWorkers: "Travailleurs de bureau",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    weeklyShowersLabel: "Douches hebdomadaires",
    avgVibeLevel: "Niveau de vibe moyen",
    peakDays: "Jours de pointe",
    lineChartDescription: "Ce graphique linéaire montre la corrélation entre la fréquence quotidienne des douches et les scores d'état mental tout au long de la semaine. Remarquez comment la fréquence des douches (ligne bleue) et le bien-être mental (ligne verte) suivent souvent des modèles similaires.",
    barChartDescription: "Ce graphique à barres affiche les niveaux de vibe quotidiens avec des barres codées par couleur. Les barres vertes indiquent des vibes élevées (8-10), bleues pour de bonnes vibes (6-7), orange pour des vibes moyennes (4-5), et rouges pour des vibes faibles (0-3).",
    pieChartDescription: "Ce graphique circulaire montre la répartition de l'utilisation des produits de douche. Il révèle les préférences entre shampooing, gel douche, utiliser les deux, ou sauter complètement les produits.",
    heroTitle: "Découvrez vos habitudes de douche",
    heroSubtitle: "Explorez la fascinante corrélation entre la fréquence des douches et le bien-être mental. Voyez comment votre routine quotidienne affecte vos niveaux de vibe et votre énergie globale.",
    disclaimerNote: "Note",
    disclaimerText: "Ce tableau de bord utilise des données synthétiques à des fins de démonstration. Les corrélations montrées sont fictives et destinées à la visualisation éducative."
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 