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
    dashboard: "Dashboard",
    about: "About",
    login: "Login",
    logout: "Logout",
    profile: "Profile",
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
    disclaimerText: "This dashboard uses synthetic data for demonstration purposes. The correlations shown are fictional and meant for educational visualization.",
    achievements: "Achievements",
    settings: "Settings",
    memberSince: "Member since",
    totalShowers: "Total Showers",
    currentStreak: "Current Streak",
    avgVibe: "Avg Vibe",
    profileInformation: "Profile Information",
    username: "Username",
    email: "Email",
    joinDate: "Join Date",
    yourAchievements: "Your Achievements",
    noAchievementsYet: "No achievements unlocked yet!",
    startTrackingToUnlock: "Start tracking your showers to unlock achievements.",
    features: "Features",
    dataPrivacy: "Data & Privacy",
    syntheticData: "Synthetic Data",
    syntheticDataDesc: "The dashboard uses clearly marked synthetic data for educational visualization purposes. All correlations shown are fictional and meant to demonstrate interactive data visualization techniques.",
    yourPrivacy: "Your Privacy",
    yourPrivacyDesc: "When you create an account, your personal shower data is stored securely and privately. We use Firebase authentication and Firestore database to ensure your information is protected.",
    educationalPurpose: "Educational Purpose",
    educationalPurposeDesc: "This project was created for educational purposes as part of a UI/UX course assignment. It demonstrates modern web development techniques and data visualization best practices.",
    readyToStart: "Ready to Start Tracking?",
    readyToStartDesc: "Join thousands of users who are discovering the connection between their shower habits and mental wellness. Create your account and start your journey today!",
    interactiveAnalytics: "Interactive Analytics",
    interactiveAnalyticsDesc: "Beautiful charts and data visualization to track your shower habits and mental wellness correlation.",
    achievementSystem: "Achievement System",
    achievementSystemDesc: "Unlock achievements and track your progress with a gamified experience that keeps you motivated.",
    communityInsights: "Community Insights",
    communityInsightsDesc: "Compare your habits with different groups - students, remote workers, and office professionals.",
    realTimeTracking: "Real-time Tracking",
    realTimeTrackingDesc: "Log your daily showers and mood levels with our intuitive interface and real-time data sync.",
    mentalWellnessFocus: "Mental Wellness Focus",
    mentalWellnessFocusDesc: "Understand the connection between personal hygiene and mental health through data-driven insights.",
    personalDashboard: "Personal Dashboard",
    personalDashboardDesc: "Your own personalized space to track progress, view statistics, and manage your shower journey.",
    welcomeBack: "Welcome Back!",
    welcomeBackDesc: "Track your shower habits and unlock achievements",
    joinShowerClub: "Join the Shower Club!",
    joinShowerClubDesc: "Start your journey to better hygiene and mental wellness",
    password: "Password",
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    unlockAchievements: "Unlock Achievements",
    trackProgress: "Track Progress",
    mentalWellness: "Mental Wellness",
    
    // Log Shower
    logShower: "Log Shower",
    logShowerDescription: "Track your daily showers and mood to see patterns and earn achievements!",
    date: "Date",
    didYouShower: "Did you shower today?",
    yes: "Yes",
    no: "No",
    howAreYouFeeling: "How are you feeling?",
    productsUsed: "Products used",
    notes: "Notes",
    optional: "optional",
    notesPlaceholder: "How was your shower? Any thoughts?",
    logEntry: "Log Entry",
    showerLoggedSuccessfully: "Shower logged successfully!",
    recentEntries: "Recent Entries",
    noEntriesYet: "No entries yet",
    startLoggingToSeeHistory: "Start logging to see your history here",
    showered: "Showered",
    noShower: "No shower",
    
    // Vibe levels
    vibeAmazing: "Amazing!",
    vibeGood: "Good",
    vibeOkay: "Okay",
    vibeBad: "Bad",
    vibeTerrible: "Terrible",
    
    // Products
    conditioner: "Conditioner",
    faceWash: "Face Wash",
    
    // Settings
    emailReminders: "Email Reminders",
    emailRemindersDesc: "Receive daily email reminders to log your shower and track your mood",
    reminderTime: "Reminder Time",
    exportData: "Export Data",
    exportDataDesc: "Download all your shower data and achievements as a JSON file",
    download: "Download",
    deleteAccount: "Delete Account",
    deleteAccountDesc: "Permanently delete your account and all associated data. This action cannot be undone.",
    delete: "Delete",
    deleteAccountConfirm: "Delete Account?",
    deleteAccountWarning: "This will permanently delete your account and all your shower data. This action cannot be undone.",
    cancel: "Cancel",
    
    // Time options
    "7am": "7:00 AM",
    "8am": "8:00 AM",
    "9am": "9:00 AM",
    "10am": "10:00 AM",
    "11am": "11:00 AM",
    "12pm": "12:00 PM",
    "6pm": "6:00 PM",
    "7pm": "7:00 PM",
    "8pm": "8:00 PM",
    "9pm": "9:00 PM",
    
    // Footer
    madeWithLove: "Made with love and shampoo",
    madeWithLoveFr: "Fait avec amour et shampooing"
  },
  fr: {
    title: "As-tu pris une douche aujourd'hui?",
    subtitle: "Un tableau de bord interactif qui visualise la corrélation entre la fréquence des douches et la stabilité mentale, l'énergie et les bonnes vibes.",
    dashboard: "Tableau de bord",
    about: "À propos",
    login: "Connexion",
    logout: "Déconnexion",
    profile: "Profil",
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
    disclaimerText: "Ce tableau de bord utilise des données synthétiques à des fins de démonstration. Les corrélations montrées sont fictives et destinées à la visualisation éducative.",
    achievements: "Réalisations",
    settings: "Paramètres",
    memberSince: "Membre depuis",
    totalShowers: "Total des douches",
    currentStreak: "Série actuelle",
    avgVibe: "Vibe moyenne",
    profileInformation: "Informations du profil",
    username: "Nom d'utilisateur",
    email: "Email",
    joinDate: "Date d'inscription",
    yourAchievements: "Vos réalisations",
    noAchievementsYet: "Aucune réalisation débloquée pour le moment !",
    startTrackingToUnlock: "Commencez à suivre vos douches pour débloquer des réalisations.",
    features: "Fonctionnalités",
    dataPrivacy: "Données et confidentialité",
    syntheticData: "Données synthétiques",
    syntheticDataDesc: "Le tableau de bord utilise des données synthétiques clairement marquées à des fins de visualisation éducative. Toutes les corrélations montrées sont fictives et destinées à démontrer les techniques de visualisation de données interactives.",
    yourPrivacy: "Votre confidentialité",
    yourPrivacyDesc: "Lorsque vous créez un compte, vos données personnelles de douche sont stockées de manière sécurisée et privée. Nous utilisons l'authentification Firebase et la base de données Firestore pour garantir la protection de vos informations.",
    educationalPurpose: "Objectif éducatif",
    educationalPurposeDesc: "Ce projet a été créé à des fins éducatives dans le cadre d'un devoir de cours UI/UX. Il démontre les techniques modernes de développement web et les meilleures pratiques de visualisation de données.",
    readyToStart: "Prêt à commencer le suivi ?",
    readyToStartDesc: "Rejoignez des milliers d'utilisateurs qui découvrent la connexion entre leurs habitudes de douche et le bien-être mental. Créez votre compte et commencez votre voyage aujourd'hui !",
    interactiveAnalytics: "Analyses interactives",
    interactiveAnalyticsDesc: "De beaux graphiques et une visualisation des données pour suivre la corrélation entre vos habitudes de douche et le bien-être mental.",
    achievementSystem: "Système de réalisations",
    achievementSystemDesc: "Débloquez des réalisations et suivez vos progrès avec une expérience gamifiée qui vous motive.",
    communityInsights: "Aperçus de la communauté",
    communityInsightsDesc: "Comparez vos habitudes avec différents groupes - étudiants, travailleurs à distance et professionnels de bureau.",
    realTimeTracking: "Suivi en temps réel",
    realTimeTrackingDesc: "Enregistrez vos douches quotidiennes et vos niveaux d'humeur avec notre interface intuitive et la synchronisation des données en temps réel.",
    mentalWellnessFocus: "Focus sur le bien-être mental",
    mentalWellnessFocusDesc: "Comprenez la connexion entre l'hygiène personnelle et la santé mentale grâce à des insights basés sur les données.",
    personalDashboard: "Tableau de bord personnel",
    personalDashboardDesc: "Votre propre espace personnalisé pour suivre les progrès, voir les statistiques et gérer votre parcours de douche.",
    welcomeBack: "Bon retour !",
    welcomeBackDesc: "Suivez vos habitudes de douche et débloquez des réalisations",
    joinShowerClub: "Rejoignez le Club de Douche !",
    joinShowerClubDesc: "Commencez votre voyage vers une meilleure hygiène et un bien-être mental",
    password: "Mot de passe",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    createAccount: "Créer un compte",
    noAccount: "Vous n'avez pas de compte ?",
    haveAccount: "Vous avez déjà un compte ?",
    unlockAchievements: "Débloquer des réalisations",
    trackProgress: "Suivre les progrès",
    mentalWellness: "Bien-être mental",
    
    // Log Shower
    logShower: "Enregistrer une douche",
    logShowerDescription: "Suivez vos douches quotidiennes et votre humeur pour voir les tendances et gagner des réalisations !",
    date: "Date",
    didYouShower: "Avez-vous pris une douche aujourd'hui ?",
    yes: "Oui",
    no: "Non",
    howAreYouFeeling: "Comment vous sentez-vous ?",
    productsUsed: "Produits utilisés",
    notes: "Notes",
    optional: "optionnel",
    notesPlaceholder: "Comment était votre douche ? Des réflexions ?",
    logEntry: "Enregistrer l'entrée",
    showerLoggedSuccessfully: "Douche enregistrée avec succès !",
    recentEntries: "Entrées récentes",
    noEntriesYet: "Aucune entrée pour le moment",
    startLoggingToSeeHistory: "Commencez à enregistrer pour voir votre historique ici",
    showered: "Douche prise",
    noShower: "Pas de douche",
    
    // Vibe levels
    vibeAmazing: "Incroyable !",
    vibeGood: "Bien",
    vibeOkay: "Correct",
    vibeBad: "Mauvais",
    vibeTerrible: "Terrible",
    
    // Products
    conditioner: "Après-shampooing",
    faceWash: "Nettoyant visage",
    
    // Settings
    emailReminders: "Rappels par email",
    emailRemindersDesc: "Recevez des rappels quotidiens par email pour enregistrer votre douche et suivre votre humeur",
    reminderTime: "Heure du rappel",
    exportData: "Exporter les données",
    exportDataDesc: "Téléchargez toutes vos données de douche et réalisations sous forme de fichier JSON",
    download: "Télécharger",
    deleteAccount: "Supprimer le compte",
    deleteAccountDesc: "Supprimez définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.",
    delete: "Supprimer",
    deleteAccountConfirm: "Supprimer le compte ?",
    deleteAccountWarning: "Cela supprimera définitivement votre compte et toutes vos données de douche. Cette action ne peut pas être annulée.",
    cancel: "Annuler",
    
    // Time options
    "7am": "7h00",
    "8am": "8h00",
    "9am": "9h00",
    "10am": "10h00",
    "11am": "11h00",
    "12pm": "12h00",
    "6pm": "18h00",
    "7pm": "19h00",
    "8pm": "20h00",
    "9pm": "21h00",
    
    // Footer
    madeWithLove: "Fait avec amour et shampooing",
    madeWithLoveFr: "Fait avec amour et shampooing"
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