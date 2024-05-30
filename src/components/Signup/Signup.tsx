import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  email: string;
  password: string;
  confirmPassword: string;
  message: string;
}

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Errors>({ email: '', password: '', confirmPassword: '', message: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({ email: '', password: '', confirmPassword: '', message: '' });

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, message: 'Passwords do not match' });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/url-shortener/api/V1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, message: result.message, email: 'error' });
      } else {
        login(result.jwtToken, formData.email);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrors({ ...errors, message: 'An unexpected error occurred' });
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
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
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={errors.message ? 'input-error' : ''}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.message && <p className="error-message">{errors.message}</p>}
        </div>
        <p className='validation'>
          At least 8 characters, at least one digit, one uppercase letter, one lowercase letter. No spaces are allowed.
        </p>
        <button type="submit" className='submit-button'>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
