import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { publicRequest } from "../requestMethod";
import { RiTwitterFill } from "react-icons/ri";
import { RiHome4Fill } from "react-icons/ri";
import { RiUser3Fill } from "react-icons/ri";
import { RiLogoutBoxRLine } from "react-icons/ri";
import profileImage from "../dummy.png";
import "../App.css";

const Sidebar = () => {
  // State variables
  const [profileDetails, setProfileDetails] = useState({});
  const currentUser = JSON.parse(localStorage.getItem("userData"));

  // Fetch profile details on component mount and when currentUser state changes
  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        const res = await publicRequest("/user/" + currentUser._id);
        setProfileDetails(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProfileDetails();
  }, [currentUser?._id]);

  // Logout function
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center border-end ms-0 ps-0">
      <div>
        <h1>
          <RiTwitterFill className="logo" />
        </h1>
      </div>
      <div className="d-flex flex-column mt-4">
        <Link id="link-off"
          to="/"
          className="link-default-off rounded-pill text-dark d-flex sidebar-hover align-items-center p-2"
        >
          <h4 className="me-2">
            <RiHome4Fill />
          </h4>
          <h4>Home</h4>
        </Link>
        <Link id="link-off"
          to={"/profile/" + currentUser?._id}
          className="link-default-off rounded-pill text-dark d-flex sidebar-hover align-items-center p-2"
        >
          <h4 className="me-2">
            <RiUser3Fill />
          </h4>
          <h4>Profile</h4>
        </Link>
        <Link id="link-off" className="link-default-off rounded-pill text-dark d-flex sidebar-hover align-items-center p-2">
          <h4 className="me-2">
            <RiLogoutBoxRLine />
          </h4>
          <h4 onClick={logout}>Logout</h4>
        </Link>
      </div>

      <div className="details d-flex mt-auto">
        <div className="profile-picture pe-2">
          {currentUser?.profilePicture ? (
            <img
              src={"http://localhost:5000/" + currentUser?.profilePicture}
              alt="profile"
              className="profile-tweet-img"
            />
          ) : (
            <img src={profileImage} alt="dummy" className="profile-tweet-img" />
          )}
        </div>
        <div className="d-flex flex-column">
          <h4 className="text-capitalize">{profileDetails?.name}</h4>
          <h6>@{currentUser?.username}</h6>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
