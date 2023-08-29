import React from "react";
import "../App.css";
import axios from "axios";
import { BASE_URL } from "../config";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { publicRequest } from "../requestMethod";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import profileImage from "../dummy.png";
import Tweet from "../components/Tweet";
import { RiCalendar2Fill } from "react-icons/ri";
import { RiCake2Fill } from "react-icons/ri";
import { RiPinDistanceFill } from "react-icons/ri";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [profileDetails, setProfileDetails] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [update, setUpdate] = useState("");
  const currentUserId = JSON.parse(localStorage.getItem("userData"))?._id;
  const { id } = useParams();
  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        const res = await publicRequest("/user/" + id);
        setProfileDetails(res.data);
        setIsFollowing(res.data.followers.includes(currentUserId));
      } catch (error) {
        console.log(error);
      }
    };
    getProfileDetails();

    const fetchTweets = async () => {
      try {
        const response = await axios.get( BASE_URL + 
          "http://localhost:5000/api/user/" + id + "/tweets"
        );
        setTweets(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTweets();
  }, [id, update, isFollowing, currentUserId, profile]);

  const profilePictureSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const image = await fetch(profilePicture).then((res) => res.blob());
    formData.append("profile-image", image, "image.jpg");

    try {
      const response = await axios.post( BASE_URL + 
        "http://localhost:5000/api/user/" + id + "/uploadProfilePic",
        formData,
        {
          headers: {
            Token: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      setProfilePicture(null);
      setIsProfileOpen(false);

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile picture!");
    }
    window.location.reload();
  };

  const detailSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the API call to update the user details
      const response = await axios.put( BASE_URL + 
        "http://localhost:5000/api/user/" + id,
        {
          name: name,
          location: location,
          dateOfBirth: dateOfBirth,
        },
        {
          headers: {
            Token: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      toast.success("User details updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user details!");
    }
    setProfile(!profile);
    closeModalDetails();
    window.location.reload();
  };

  const handleFollowUser = async () => {
    try {
      const response = await axios.post( BASE_URL + 
        "http://localhost:5000/api/user/" + id + "/follow",
        {
          userId: currentUserId,
        },
        {
          headers: {
            Token: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setIsFollowing(true);
      toast.success("User followed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to follow user!");
    }
  };

  const handleUnfollowUser = async () => {
    try {
      const response = await axios.post( BASE_URL + 
        "http://localhost:5000/api/user/" + id + "/unfollow",
        {
          userId: currentUserId,
        },
        {
          headers: {
            Token: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setIsFollowing(false);
      toast.success("User unfollowed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to unfollow user!");
    }
  };

  const handleImage = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const openModalProfile = () => {
    setIsProfileOpen(true);
  };

  const closeModalProfile = () => {
    setIsProfileOpen(false);
  };

  const openModalDetails = () => {
    setIsDetailOpen(true);
  };

  const closeModalDetails = () => {
    setIsDetailOpen(false);
  };

  const date = new Date(profileDetails.createdAt);
  const options = {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return (
    <div className="container d-flex  vw-100 vh-100 justify-content-center align-items-center">
      <div className="wrapper scroll vh-100">
        <div className="ms-0 ps-0 sidebar-cont">
          <Sidebar />
        </div>
        <div className="d-flex flex-column ps-3 scroll-on custom-scrollbar w-100 ms-2">
          <div className="blue">
            <div className="profile-img">
              {profileDetails.profilePicture ? (
                <img
                  src={"http://localhost:5000/" + profileDetails.profilePicture}
                  alt="profile"
                  className=""
                />
              ) : (
                <img src={profileImage} alt="dummy" />
              )}
            </div>
          </div>
          <div className="d-flex flex-row-reverse pe-3 mt-2">
            {currentUserId === profileDetails._id ? (
              <>
                <button
                  className="mx-3 btn btn-outline-dark"
                  onClick={openModalDetails}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={openModalProfile}
                >
                  Upload Profile Photo
                </button>
              </>
            ) : (
              <button
                className="mx-3 btn btn-outline-primary"
                onClick={isFollowing ? handleUnfollowUser : handleFollowUser}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            <Modal show={isProfileOpen} onHide={closeModalProfile}>
              <Modal.Header closeButton>
                <Modal.Title>Update Profile Picture</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input type="file" onChange={handleImage} accept="image/*" />

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Tweet Preview"
                    style={{ width: "100%" }}
                  />
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModalProfile}>
                  Close
                </Button>
                <Button variant="primary" onClick={profilePictureSubmit}>
                  Update
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={isDetailOpen} onHide={closeModalDetails}>
              <Modal.Header closeButton>
                <Modal.Title>Update Details</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex flex-column">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  onChange={(e) => setLocation(e.target.value)}
                />
                <label>Date of Birth</label>
                <input
                  type="date"
                  placeholder="dd/mm/yyyy"
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModalDetails}>
                  Close
                </Button>
                <Button variant="primary" onClick={detailSubmit}>
                  Update
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <div className="mt-4">
            <h4 className="text-capitalize">{profileDetails.name}</h4>
            <p>@{profileDetails.username}</p>
          </div>
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              <span>
                {profileDetails?.dateOfBirth && (
                  <>
                    <RiCake2Fill className="me-2" />
                    {profileDetails.dateOfBirth}
                  </>
                )}
              </span>
              <span className="text-capitalize">
                {profileDetails?.location && (
                  <span>
                    <RiPinDistanceFill className="ms-3 me-2" />
                    {profileDetails.location}
                  </span>
                )}
              </span>
            </div>
            <div>
              <span>
                <RiCalendar2Fill className="me-2" />
                Joined {formattedDate}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="fw-bold">
              {profileDetails?.following?.length} Following
            </span>
            <span className="px-2 fw-bold">
              {profileDetails?.followers?.length} Followers
            </span>
          </div>
          <div>
            <div className="text-center mt-4">
              <h4>Tweets and Replies</h4>
            </div>
            <div>
              {tweets?.map((tweet) => (
                <Tweet
                  tweet={tweet}
                  key={tweet._id}
                  setUpdate={setUpdate}
                  currentUser={currentUserId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
