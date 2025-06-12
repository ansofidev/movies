import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import type { RootState } from '../../app/store';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';

const Header: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <nav>
        <div>
          <Link to="/" className="header__link">
            Home
          </Link>
        </div>
        {token && (
          <button onClick={handleLogout} className="header__btn">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
