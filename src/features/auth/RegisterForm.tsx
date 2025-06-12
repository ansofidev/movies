import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/AuthForm.scss';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axiosInstance.post('/users', {
        email,
        name,
        password,
        confirmPassword,
      });

      if (res.data.status === 1 && res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        setError('Registration failed');
      }
    } catch (e) {
      setError('Registration error');
      console.error(e);
    }
  };

  return (
    <div className="auth-form">
      <div className="card">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
