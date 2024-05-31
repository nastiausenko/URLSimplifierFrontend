import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import './Header.css';
import icon from '../../../img/icon.jpg';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, email, logout } = useAuth();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleMyLinks = () => {
    navigate('/my-links');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="header-navbar">
      <Container fluid className="header-container">
        <Nav className="me-auto" navbarScroll>
          <NavLink className="nav-link" to="/">
            <img src={icon} alt="Home" className="home-icon" />
          </NavLink>
        </Nav>
        <div className="link-group">
          {isLoggedIn ? (
            <div className="dropdown" onClick={toggleMenu}>
              <span className="dropdown-toggle">
                {email} {menuVisible ? '▲' : '▼'}
              </span>
              {menuVisible && (
                <div className="dropdown-menu">
                  <button className="my-links-button" onClick={handleMyLinks}>My Links</button>
                  <button className="edit-button" onClick={handleEditProfile}>Edit Profile</button>
                  <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink className="login" to="/login">Log In</NavLink>
              <NavLink className="signup" to="/signup">Sign Up</NavLink>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
