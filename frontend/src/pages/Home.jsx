import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import Sidebar from "../components/sidebar";
import Tweet from "../components/Tweet";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "../App.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // State variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tweetContent, setTweetContent] = useState("");
  const [tweetImage, setTweetImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const currentUserId = JSON.parse(localStorage.getItem("userData"))?._id;
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState("");
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  if (currentUserId == null || currentUserId === undefined) {
    navigate("/login");
  }

  // Handle image selection for tweet
  const handleImage = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTweetImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  // Submit tweet
  const tweetSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", tweetContent);
    if (tweetImage) {
      const image = await fetch(tweetImage).then((res) => res.blob());
      formData.append("tweet-image", image, "image.jpg");
    }

    try {
      const response = await axios.post( BASE_URL + 
        "http://localhost:5000/api/tweet",
        formData,
        {
          headers: {
            Token: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setUpdate(response.data);
      setTweetContent("");
      setTweetImage(null);
      setIsModalOpen(false);

      toast.success("Tweet sent successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  // Open and close tweet modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch tweets on component mount and when update state changes
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get( BASE_URL + "http://localhost:5000/api/tweet");
        setTweets(response.data.tweets);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTweets();
  }, [update]);

  return (
    <div className="container d-flex  vw-100 vh-100 justify-content-center align-items-center">
      <div className="wrapper scroll vh-100">
        <div className="ms-0 ps-0 sidebar-cont">
          <Sidebar />
        </div>
        <div className="d-flex flex-column ps-3 scroll-on custom-scrollbar w-100">
          <div className="d-flex justify-content-between ps-1 my-1 me-1">
            <h3 className="fw-bold">Home</h3>
            <button
              onClick={openModal}
              className="btn btn-primary d-inline-block"
            >
              Tweet
            </button>
            <Modal show={isModalOpen} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Tweet</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <textarea
                  value={tweetContent}
                  onChange={(e) => setTweetContent(e.target.value)}
                  placeholder="What's on your mind?"
                  rows="3"
                  style={{ width: "100%", resize: "none" }}
                />
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
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={tweetSubmit}>
                  Add Tweet
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <div className="mt-2">
            {loading ? (
              <h1>Loading...</h1>
            ) : (
              tweets.map((tweet) => (
                <Tweet
                  tweet={tweet}
                  key={tweet?._id}
                  currentUser={currentUserId}
                  setUpdate={setUpdate}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
