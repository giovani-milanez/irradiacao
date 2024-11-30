import React from 'react';
// import UserInterface from '../components/UserInterface';
import LoginComponent from '@/components/Login';

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <div>
        <LoginComponent></LoginComponent>
      </div>
    </main>
  );
};

export default Home;