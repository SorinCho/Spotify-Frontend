import React from 'react';
import Home from './pages/Home';
// import Login from './pages/Login';
import './components/Header.scss';

export default function AppRouter() {
  return (
    <div className="page">
      <Home />
    </div>
  );
}
