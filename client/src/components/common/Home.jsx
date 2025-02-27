import React from "react";
import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";
import { adminContextObj } from "../../contexts/AdminContext.jsx";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { currentAdmin, setCurrentAdmin } = useContext(adminContextObj);

  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // console.log("isSignedIn :", isSignedIn);
  console.log("user :", user);
  // console.log("isLoaded :", isLoaded);

  async function onSelectRole(e) {
    //clear error property
    setError("");
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    currentAdmin.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === "author") {
        res = await axios.post(
          "http://localhost:3000/author-api/author",
          currentUser
        );
        let { message, payload } = res.data;
        if (message === "author") {
          setCurrentUser({
            ...currentUser,
            ...payload,
          });
          //save user to localstorage
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
      if (selectedRole === "user") {
        res = await axios.post(
          "http://localhost:3000/user-api/user",
          currentUser
        );
        let { message, payload } = res.data;
        if (message === "user") {
          setCurrentUser({
            ...currentUser,
            ...payload,
          });
          //save user to localstorage
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
      if (selectedRole === "admin") {
        res = await axios.post(
          "http://localhost:3000/admin-api/admin",
          currentAdmin
        );
        let { message, payload } = res.data;
        console.log(message);
        if (message === "admin") {
          setCurrentAdmin({
            ...currentAdmin,
            ...payload,
          });
          //save user to local storage
          localStorage.setItem("currentadmin", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }
  console.log("current user : ", currentUser);
  console.log("current admin: ", currentAdmin);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 300);

    setCurrentUser({
      ...currentUser,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    });
    setCurrentAdmin({
      ...currentAdmin,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    });

    return () => clearTimeout(timeoutId);

  }, [isLoaded]);

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`author-profile/${currentUser.email}`);
    }
    if (currentAdmin?.role === "admin" && error.length === 0) {
      navigate(`admin-profile/${currentAdmin.email}`);
    }
  }, [currentUser, currentAdmin]);

  return (
    <div className="container py-5">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {isSignedIn === false && (
            <div>
              <h2
                className="text-center text-dark mb-5"
                style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  background: 'linear-gradient(45deg, #9b59b6, #e91e63)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '2px 2px 15px rgba(0, 0, 0, 0.2)',
                  padding: '20px 0',
                }}
              >
                Welcome to the Blog App
              </h2>
  
              <div className="card mb-5">
                <div className="card-body">
                  <h5 className="card-title text-primary text-center mb-4">
                    Roles Overview
                  </h5>
  
                  {/* Row for content */}
                  <div className="row text-center">
  {/* Author Section */}
  <div className="col-md-4 mb-4">
    <div className="card shadow-sm rounded-lg border-primary">
      <img
        src="https://via.placeholder.com/150x100?text=Author+Image"
        className="card-img-top rounded-circle mb-3"
        alt="Author"
      />
      <div className="card-body">
        <h6 className="card-title text-info mb-3">Author</h6>
        <p className="card-text">
          Authors create and write blog posts, contributing content to the platform.
        </p>
      </div>
    </div>
  </div>

  {/* User Section */}
  <div className="col-md-4 mb-4">
    <div className="card shadow-sm rounded-lg border-success">
      <img
        src="https://via.placeholder.com/150x100?text=User+Image"
        className="card-img-top rounded-circle mb-3"
        alt="User"
      />
      <div className="card-body">
        <h6 className="card-title text-success mb-3">User</h6>
        <p className="card-text">
          Users can read, comment, and engage with content, but cannot create posts.
        </p>
      </div>
    </div>
  </div>

  {/* Admin Section */}
  <div className="col-md-4 mb-4">
    <div className="card shadow-sm rounded-lg border-danger">
      <img
        src="https://via.placeholder.com/150x100?text=Admin+Image"
        className="card-img-top rounded-circle mb-3"
        alt="Admin"
      />
      <div className="card-body">
        <h6 className="card-title text-danger mb-3">Admin</h6>
        <p className="card-text">
          Admins oversee the platform, managing posts and user interactions.
        </p>
      </div>
    </div>
  </div>
</div>

                </div>
              </div>
            </div>
          )}
  
          {isSignedIn === true && (
            <div>
              <div className="d-flex justify-content-center align-items-center mb-5">
  <img
    src={user.imageUrl}
    width="80px"
    height="80px"
    className="rounded-circle"
    alt="User profile"
  />
  <div className="ms-4 text-center">
    <h3 className="text-dark fw-bold">{user.firstName}</h3>
    <p className="text-secondary mb-0">{user.emailAddresses[0].emailAddress}</p>
  </div>
</div>

  
              <h3 className="text-center mb-4 text-primary">Select Your Role</h3>
              {error.length !== 0 && (
                <p
                  className="text-danger fs-5 font-monospace"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  {error}
                </p>
              )}
  
  <div className="d-flex role-radio py-3 justify-content-center">
  {/* Author Button */}
  <div className="form-check me-4">
    <input
      type="radio"
      name="role"
      value="author"
      id="author"
      className="form-check-input visually-hidden"
      onChange={onSelectRole}
      style={{ display: 'none' }}
    />
    <label
      htmlFor="author"
      className="form-check-label role-button"
      style={{
        padding: '10px 20px',
        borderRadius: '30px',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.backgroundColor = '#9c27b0'; // Light Purple for Author
        e.target.style.color = 'white'; // White text for contrast
        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.backgroundColor = '#f8f9fa'; // Reset to original background color
        e.target.style.color = 'black';
        e.target.style.boxShadow = 'none';
      }}
    >
      Author
    </label>
  </div>

  {/* User Button */}
  <div className="form-check me-4">
    <input
      type="radio"
      name="role"
      value="user"
      id="user"
      className="form-check-input visually-hidden"
      onChange={onSelectRole}
      style={{ display: 'none' }}
    />
    <label
      htmlFor="user"
      className="form-check-label role-button"
      style={{
        padding: '10px 20px',
        borderRadius: '30px',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.backgroundColor = '#fbe8a6'; // Soft Yellow for User
        e.target.style.color = 'black'; // Black text for contrast
        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.backgroundColor = '#f8f9fa'; // Reset to original background color
        e.target.style.color = 'black';
        e.target.style.boxShadow = 'none';
      }}
    >
      User
    </label>
  </div>

  {/* Admin Button */}
  <div className="form-check">
    <input
      type="radio"
      name="role"
      value="admin"
      id="admin"
      className="form-check-input visually-hidden"
      onChange={onSelectRole}
      style={{ display: 'none' }}
    />
    <label
      htmlFor="admin"
      className="form-check-label role-button"
      style={{
        padding: '10px 20px',
        borderRadius: '30px',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.backgroundColor = '#424242'; // Dark Gray for Admin
        e.target.style.color = 'white'; // White text for contrast
        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.backgroundColor = '#f8f9fa'; // Reset to original background color
        e.target.style.color = 'black';
        e.target.style.boxShadow = 'none';
      }}
    >
      Admin
    </label>
  </div>
</div>





            </div>
          )}
        </div>
      )}
    </div>
  );
  
  
  
}

export default Home;