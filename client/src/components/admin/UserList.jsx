// 

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { adminContextObj } from "../../contexts/AdminContext";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { currentAdmin, setCurrentAdmin } = useContext(adminContextObj);

  async function toggleDisableEnable(userObj) {
    const updatedStatus = !userObj.isActive;
    userObj.isActive = updatedStatus;
    let res = await axios.put(
      `http://localhost:3000/admin-api/user/${userObj._id}`,
      { ...userObj }
    );
    if (res.data.message === "updated") {
      setCurrentAdmin(res.data.payload);
    }
  }

  //get all users
  async function getUsers() {
    let res = await axios.get("http://localhost:3000/admin-api/users");
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
          <p className="display-4 text-center mt-5">{error}</p>
        )}

        <div className="container text-center">
          <p className="display-4">Active users</p>

          {users.some((userObj) => userObj.isActive) ? (
            users.map(
              (userObj, i) =>
                userObj.isActive === true && (
                  <div className="row" key={i}>
                    <div className="col g-2 px-4 py-4 bg-warning-subtle">
                      <div className="d-flex justify-content-evenly align-items-center">
                        <div>
                          <img
                            src={userObj.profileImageUrl}
                            alt="ProfileImage"
                            width="40px"
                            className="rounded-circle"
                          />
                        </div>
                        <div>
                          <p className="text-secondary">{userObj.firstName}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-danger">{userObj.role}</p>
                        </div>
                        <div>
                          <p className="text-dark">
                            {userObj.isActive === true ? "Active" : "Inactive"}
                          </p>
                        </div>
                        <div>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => toggleDisableEnable(userObj)}
                          >
                            Disable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )
          ) : (
            <p className="lead ">No Active users</p>
          )}
        </div>

        <div className="container text-center mt-4">
          <p className="display-4">Inactive users</p>

          {users.some((userObj) => !userObj.isActive) ? (
            users.map(
              (userObj, i) =>
                userObj.isActive === false && (
                  <div className="row" key={i}>
                    <div className="col g-2 px-4 py-4 bg-warning-subtle rounded">
                      <div className="d-flex justify-content-evenly align-items-center ">
                        <div>
                          <img
                            src={userObj.profileImageUrl}
                            alt="ProfileImage"
                            width="40px"
                            className="rounded-circle"
                          />
                        </div>
                        <div className="">
                          <p className="text-secondary text-center">
                            {userObj.firstName}
                          </p>
                        </div>
                        <div>
                          <p className="text-danger text-center">
                            {userObj.role}
                          </p>
                        </div>
                        <div>
                          <p className="text-dark">
                            {userObj.isActive === true ? "Active" : "Inactive"}
                          </p>
                        </div>
                        <div>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => toggleDisableEnable(userObj)}
                          >
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )
          ) : (
            <p className="lead ">No Inactive users</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserList;