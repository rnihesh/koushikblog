import { useContext } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';

function Header() {
  const { signOut } = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();

  async function handleSignout() {
    await signOut();
    setCurrentUser(null);
    localStorage.clear()
    navigate('/');
  }

  return (
    <div>
      <nav
        className="header d-flex justify-content-between align-items-center p-4 bg-gradient text-white "
        style={{
          background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
          margin: "20px",
          borderRadius: "8px", 
        }}
      >
        {/* Logo Section */}
        <div className="d-flex justify-content-center">
          <Link to="/">
            <img
              src="https://via.placeholder.com/150" // Replace with your logo URL
              alt="Logo"
              width="150px"
              className="rounded"
              style={{ border: "2px solid #fff" }}
            />
          </Link>
        </div>
  
        {/* Links or User Information Section */}
        <ul className="d-flex justify-content-around align-items-center list-unstyled m-0">
          {!isSignedIn ? (
            <>
              <li>
                <Link
                  to="/"
                  className="link text-muted me-4 fs-5"
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="signin"
                  className="link text-muted me-4 fs-5"
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                >
                  Signin
                </Link>
              </li>
              <li>
                <Link
                  to="signup"
                  className="link text-muted me-4 fs-5"
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                >
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <div className="user-button d-flex align-items-center">
              <div style={{ position: "relative" }}>
                <img
                  src={user.imageUrl}
                  width="40px"
                  className="rounded-circle border border-2 border-light"
                  alt="User Avatar"
                />
                <p
                  className="role position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                  style={{ fontSize: "12px" }}
                >
                  {currentUser.role}
                </p>
              </div>
              <div className="ms-2">
                <p className="mb-0 text-white" style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {user.firstName}
                </p>
                <button
                  className="btn btn-outline-light btn-sm mt-1"
                  onClick={handleSignout}
                  style={{
                    background: "linear-gradient(45deg, #ff6347, #ff4500)", // Gradient background for the button
                    color: "#fff", // White text for contrast
                    border: "none", // Remove default border
                    padding: "10px 20px", // Larger padding for the button
                    borderRadius: "8px", // Rounded corners for a sleek design
                    fontWeight: "bold", // Bold text for visibility
                    boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)", // Stronger shadow for a floating effect
                    transition: "all 0.3s ease", // Smooth transition for hover effect
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Signout
                </button>
              </div>
            </div>
          )}
        </ul>
      </nav>
  
      {/* Content of the Page */}
      <div style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
        {/* Your other page content goes here */}
      </div>
    </div>
  );
  

}

export default Header;
