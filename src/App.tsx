import React from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ThemeTransition from './components/ThemeTransition';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="App">
          <ThemeTransition />
          <Header />
          <Dashboard />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
