import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import "./EditLink.css"

interface FormData {
  shortLink: string;
  newShortLink: string;
}

interface Errors {
  shortLink: string;
  newShortLink: string;
  message: string;
}

export const EditLink: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ shortLink: '', newShortLink: '' });
  const [errors, setErrors] = useState<Errors>({ shortLink: '', newShortLink: '', message: '' });
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const { shortLink } = useParams();
  const normShortLink = shortLink as string;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({ shortLink: '', newShortLink: '', message: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }

      const response = await fetch(`http://localhost:8080/url-shortener/api/V1/link/edit/content?shortLink=${normShortLink}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newShortLink: formData.newShortLink })
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, message: result.message });
      } else {
        navigate('/my-links');
      }
    } catch (error) {
      console.error('Error during link edit:', error);
      setErrors({ ...errors, message: errors.message || 'An unexpected error occurred' });
    }
  };

  const handleCancel = () => {
    navigate('/my-links');
  };

  return (
    <div className="edit-link-container">
      <h1>Edit Link</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newShortLink">New Short Link</label>
          <input
            type="text"
            id="newShortLink"
            name="newShortLink"
            className={errors.newShortLink ? 'input-error' : ''}
            placeholder="Enter new short link"
            value={formData.newShortLink}
            onChange={handleChange}
            required
          />
          {errors.message && <p className="error-message">{errors.message}</p>}
        </div>
        <button type="submit" className='submit-button'>Save</button>
      </form>
      <button type="button" className='cancel-button' onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default EditLink;
