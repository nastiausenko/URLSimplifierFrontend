import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email: string;
  password: string;
  message: string;
}

export const Login = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({ email: '', password: '', message: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({ email: '', password: '', message: '' });

    try {
      const response = await fetch('http://localhost:8080/url-shortener/api/V1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, message: result.message });
      } else {
        login(result.jwtToken, formData.email);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors({ ...errors, message: 'An unexpected error occurred' });
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={errors.message ? 'input-error' : ''}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={errors.message ? 'input-error' : ''}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.message && <p className="error-message">{errors.message}</p>}
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
