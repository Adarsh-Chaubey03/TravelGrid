import React from 'react';
import TripComparisonDashboard from '../components/TripComparisonDashboard';
import AuthLayout from '../components/AuthLayout';

const MultiModalPlanner = () => {
  return (
    <AuthLayout>
      <TripComparisonDashboard />
    </AuthLayout>
  );
};

export default MultiModalPlanner;