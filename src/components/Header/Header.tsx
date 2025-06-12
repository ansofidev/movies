import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import type { RootState } from '../../app/store';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header style={{ padding: 16, background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/">Home</Link>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div>
          <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
