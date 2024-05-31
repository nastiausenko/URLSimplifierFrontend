import { useState, useEffect } from "react";
import { Link } from "../../types/Link";
import { Response } from "../../types/Response";
import './MyLinks.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const MyLinks = () => {
  const [links, setLinks] = useState<Link[] | null>(null);
  const [showActive, setShowActive] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchAllLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }

      const response = await fetch('http://localhost:8080/url-shortener/api/V1/link/all-links-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch links');
      }

      const responseData: Response = await response.json();
      setLinks(responseData.linkDtoList);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  useEffect(() => {
    fetchAllLinks();
  }, []);

  const handleCreate = () => {
    navigate('/create');
  };

  const handleActive = async () => {
    if (showActive) {
      await fetchAllLinks();
      setShowActive(false);
    } else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not logged in');
        }

        const response = await fetch('http://localhost:8080/url-shortener/api/V1/link/active-links', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch links');
        }

        const responseData: Link[] = await response.json();
        setLinks(responseData);
        setShowActive(true);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    }
  };

  const handleDelete = async (shortLink: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }

      const response = await fetch(`http://localhost:8080/url-shortener/api/V1/link/delete?shortLink=${shortLink}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete link');
      }

      if (links) {
        const updatedLinks = links.filter(link => link.shortLink !== shortLink);
        setLinks(updatedLinks);
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleRefresh = async (shortLink: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }

      const response = await fetch(`http://localhost:8080/url-shortener/api/V1/link/edit/refresh?shortLink=${shortLink}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refresh link');
      }

      if (links) {
        const updatedLinks = links.map(link => {
          if (link.shortLink === shortLink) {
            return { ...link, status: 'ACTIVE', expirationTime: link.expirationTime.slice(0, 10) };
          }
          return link;
        });
        setLinks(updatedLinks);
      }
    } catch (error) {
      console.error('Error refreshing link:', error);
    }
  };

  const handleEdit = (shortLink: string) => {
    navigate(`/edit-link/${shortLink}`);
  }

  return (
    <div className="my-table-title">
      <h1>My Links</h1>
      <div className="buttons">
        <button className="create-button" onClick={handleCreate}>Create</button>
        <button className="active-button" onClick={handleActive}>{showActive ? 'Back' : 'All Active'}</button>
        <button className="home-button" onClick={() => navigate('/')}>Home</button>
      </div>
      <div className="table">
        <div className="my-table-container">
          <table>
            <thead>
              <tr>
                <th>Usage</th>
                <th>Short Link</th>
                <th>Original Link</th>
                <th>Status</th>
                <th>Expiration Date</th>
                <th className="icons"></th>
                <th className="icons"></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {links &&
                links.map((link) => (
                  <tr key={link.id}>
                    <td>{link.usageStatistics}</td>
                    <td>
                      <a href={`http://localhost:8080/url-shortener/${link.shortLink}`}>{link.shortLink}</a>
                    </td>
                    <td>
                      <a href={link.longLink}>{link.longLink}</a>
                    </td>
                    <td>{link.status}</td>
                    <td>{link.expirationTime.slice(0, 10)}</td>
                    <td className="delete"><img src="./img/delete.jpg" alt="Delete" className="delete-icon" onClick={() => handleDelete(link.shortLink)} /></td>
                    <td className="edit"><img src="./img/edit.jpg" alt="Edit" className="edit-icon" onClick={() => handleEdit(link.shortLink)} /></td>
                    <td className="time"><img src="./img/clock.jpg" alt="Refresh" className="time-icon" onClick={() => handleRefresh(link.shortLink)} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!isLoggedIn && <p className="login-prompt">Please log in to access additional features.</p>}
        </div>
      </div>
    </div>
  );
};

export default MyLinks;
