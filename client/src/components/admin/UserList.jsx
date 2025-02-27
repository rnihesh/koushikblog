// 

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { adminContextObj } from "../../contexts/AdminContext";
import { getBaseUrl } from "../../utils/config.js";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { currentAdmin, setCurrentAdmin } = useContext(adminContextObj);

  async function toggleDisableEnable(userObj) {
    const updatedStatus = !userObj.isActive;
    userObj.isActive = updatedStatus;
    let res = await axios.put(
      `${getBaseUrl()}/admin-api/user/${userObj._id}`,
      { ...userObj }
    );
    if (res.data.message === "updated") {
      setCurrentAdmin(res.data.payload);
    }
  }

  //get all users
  async function getUsers() {
    let res = await axios.get(`${getBaseUrl()}/admin-api/users`);
    console.log("users for admin: ", res.data.payload);
    if (res.data.message === "users") {
      setUsers(res.data.payload);
      setError("");
    } else {
      setError(res.data.message);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="container">
      <div>
        {error.length !== 0 && (
          <p className="display-4 text-center mt-5 text-danger">{error}</p>
        )}
  
        {/* Active Users Section */}
        <div className="container text-center">
          <p className="display-3 mb-4 text-success">Active Users</p>
  
          {users.some((userObj) => userObj.isActive) ? (
            <div className="row">
              {users.map(
                (userObj, i) =>
                  userObj.isActive === true && (
                    <div className="col-md-4 col-sm-6 mb-4" key={i}>
                      <div className="card p-4 shadow-lg rounded-lg transition-transform hover:scale-105">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <img
                              src={userObj.profileImageUrl}
                              alt="ProfileImage"
                              width="60px"
                              className="rounded-circle me-3 border border-3 "
                            />
                            <div>
                              <p className="text-secondary mb-1 fs-5 fw-bold">{userObj.firstName}</p>
                              <p className="text-danger fs-6">{userObj.role}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-success fs-6">Active</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <button
                            className="btn btn-outline-danger px-4 py-2"
                            onClick={() => toggleDisableEnable(userObj)}
                          >
                            Disable
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="lead">No Active Users</p>
          )}
        </div>
  
        {/* Inactive Users Section */}
        <div className="container text-center mt-4">
          <p className="display-3 mb-4 text-danger">Inactive Users</p>
  
          {users.some((userObj) => !userObj.isActive) ? (
            <div className="row">
              {users.map(
                (userObj, i) =>
                  userObj.isActive === false && (
                    <div className="col-md-4 col-sm-6 mb-4" key={i}>
                      <div className="card p-4 bg-light shadow-lg rounded-lg transition-transform hover:scale-105">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <img
                              src={userObj.profileImageUrl}
                              alt="ProfileImage"
                              width="60px"
                              className="rounded-circle me-3 border border-3 border-secondary"
                            />
                            <div>
                              <p className="text-secondary mb-1 fs-5 fw-bold">{userObj.firstName}</p>
                              <p className="text-danger fs-6">{userObj.role}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-muted fs-6">Inactive</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <button
                            className="btn btn-outline-success px-4 py-2"
                            onClick={() => toggleDisableEnable(userObj)}
                          >
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="lead">No Inactive Users</p>
          )}
        </div>
      </div>
    </div>
  );
  
  
}

export default UserList;