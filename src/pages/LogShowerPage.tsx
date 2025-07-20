import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LogShowerComponent from '../components/LogShowerPage';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const LogShowerPage: React.FC = () => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-container">
      <Navigation />
      <LogShowerComponent />
      <Footer />
    </div>
  );
};

export default LogShowerPage; 