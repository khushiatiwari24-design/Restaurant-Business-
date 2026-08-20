import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurantAuth } from '../restaurant/auth/RestaurantAuthContext';

export default function SiteNavbar() {
  const { isAuthenticated, bootstrapping } = useRestaurantAuth();
  const navigate = useNavigate();

  const onRestaurantLogin = () => {
    if (!bootstrapping && isAuthenticated) {
      navigate('/restaurant/dashboard');
      return;
    }
    navigate('/restaurant-login');
  };

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <Link to="/" className="site-navbar-brand">
          <span className="site-navbar-logo">DilYum</span>
        </Link>

        <button type="button" className="site-navbar-login" onClick={onRestaurantLogin}>
          {isAuthenticated ? 'Restaurant Dashboard' : 'Restaurant Login'}
        </button>
      </div>
    </header>
  );
}
