import { useState, useEffect } from "react";
import './Create.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Errors {
  longLink: string;
  shortLink: string;
  message: string;
}

export const Create = () => {
  const [shortLink, setShortLink] = useState({ longLink: '', shortLinkName: '' });
  const [errors, setErrors] = useState<Errors>({ longLink:'', shortLink: '', message: '' });
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setShortLink({ ...shortLink, [name]: value });
  };

  const handleCancel = () => {
    navigate('/my-links');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors({ longLink:'', shortLink: '', message: '' });
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }
  
      const requestBody = shortLink.shortLinkName
        ? shortLink
        : { longLink: shortLink.longLink };
  
      const response = await fetch('http://localhost:8080/url-shortener/api/V1/link/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
  
      const result = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, message: result.message });
      } else {
        navigate('/my-links');
      }
    } catch (error) {
      console.error('Error during link creation:', error);
      setErrors({ ...errors, message: errors.message || 'An unexpected error occurred' });
    }
  };
  

  return (
    <div className="create-form">
        <h1>Create New Link</h1>
        {isLoggedIn && (
          <form onSubmit={handleSubmit} className="link-form">
            <div className="form-group">
              <label htmlFor="longLink">Original Link:</label>
              <input
                type="text"
                id="longLink"
                name="longLink"
                className={errors.longLink ? 'input-error' : ''}
                value={shortLink.longLink}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="shortLinkName">Short Link Name (Optional):</label>
              <input
                type="text"
                id="shortLinkName"
                name="shortLinkName"
                className={errors.shortLink ? 'input-error' : ''}
                value={shortLink.shortLinkName}
                onChange={handleChange}
              />
              {errors.message && <p className="error-message">{errors.message}</p>}
            </div>
            <button type="submit" className="submit-button">Create Link</button>
            <button type="button" className='cancel-button' onClick={handleCancel}>Cancel</button>
          </form>
        )}
      </div>
  );
};

export default Create;
