import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Edit.css';

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

export const Edit: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Errors>({ email: '', password: '', confirmPassword: '', message: '' });
  const [editType, setEditType] = useState<'email' | 'password' | ''>('');
  const navigate = useNavigate();
  const { login, email: loggedInEmail } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitEmail = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({ email: '', password: '', confirmPassword: '', message: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }

      const response = await fetch('http://localhost:8080/url-shortener/api/V1/user/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail: formData.email })
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, message: result.message });
      } else {
        login(result.jwtToken, formData.email);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during email change:', error);
      setErrors({ ...errors, message: errors.message || 'An unexpected error occurred' });
    }
  };

  const handleSubmitPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({ email: '', password: '', confirmPassword: '', message: '' });

    if (formData.password !== formData.confirmPassword) {
        setErrors({ ...errors, message: 'Passwords do not match' });
        return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }

      const response = await fetch('http://localhost:8080/url-shortener/api/V1/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: formData.password })
      });


      const result = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, message: result.message, email: 'error' });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error during password change:', error);
      setErrors({ ...errors, message: errors.message || 'An unexpected error occurred' });
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleEditTypeToggle = (type: 'email' | 'password') => {
    setEditType(prevType => (prevType === type ? '' : type));
  };

  return (
    <div className="signup-container">
      <h2>Edit Profile</h2>
      <div className="edit-type-selector">
        <button className={`edit-type-button ${editType === 'email' ? 'selected' : ''}`} onClick={() => handleEditTypeToggle('email')}>Edit Email</button>
        <button className={`edit-type-button ${editType === 'password' ? 'selected' : ''}`} onClick={() => handleEditTypeToggle('password')}>Change Password</button>
      </div>
      {editType === 'email' && (
        <form onSubmit={handleSubmitEmail}>
          <div className="form-group">
            <label htmlFor="email">New Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={errors.message ? 'input-error' : ''}
              placeholder="Enter new email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>
          <button type="submit" className='submit-button'>Save</button>
        </form>
      )}
      {editType === 'password' && (
        <form onSubmit={handleSubmitPassword}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={errors.message ? 'input-error' : ''}
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={errors.message ? 'input-error' : ''}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>
          <p className='validation'>
            At least 8 characters, at least one digit, one uppercase letter, one lowercase letter. No spaces are allowed.
          </p>
          <button type="submit" className='submit-button'>Save</button>
        </form>
      )}
       <button type="button" className='cancel-button' onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default Edit;
