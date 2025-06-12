import React, { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { login as loginUser } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Submitting login with:', { email, password });

  try {
    const resultAction = await dispatch(loginUser({ email, password }));
    console.log('Result action from dispatch:', resultAction);

    if (loginUser.fulfilled.match(resultAction)) {
      console.log('Login succeeded, navigating...');
      navigate('/');
    } else {
      console.log('Login failed with payload:', resultAction.payload);
      setError(resultAction.payload || 'Invalid credentials');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Login failed');
  }
};

  return (
    <div className="login-form" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" style={{ width: '100%' }}>
          Login
        </button>
        <p>
            Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
