import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { RiThumbUpLine } from "react-icons/ri";
import { RiThumbUpFill } from "react-icons/ri";
import profileImage from "../dummy.png";
import { RiMessage2Line } from "react-icons/ri";
import { RiRepeatFill } from "react-icons/ri";
import "../App.css";
import Button from "react-bootstrap/Button";
import { AiOutlineDelete } from "react-icons/ai";

const Tweet = ({ tweet, currentUser, setUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [retweetUsername, setRetweetUsername] = useState("");
  const [likes, setLikes] = useState(tweet?.likes?.length);
  const [reply, setReply] = useState("");
  const [retweet, setRetweet] = useState(false);
  const [isLiked, setIsLiked] = useState(
    tweet?.likes?.includes(currentUser) || false
  );

  useEffect(() => {
    // Check if the tweet is a retweet by the current user
    const check = async () => {
      const isRetweet = tweet?.retweetBy?.some((e) => {
        return e?._id === currentUser;
      });

      if (isRetweet) {
        setRetweet(true);
      }
    };
    check();

    // Fetch the username of the user who retweeted the tweet
    const fetchRetweetUsername = async () => {
      if (retweet && tweet?.retweetBy.length > 0) {
        try {
          const response = await axios.get( BASE_URL + 
            `http://localhost:5000/api/user/${
              tweet?.retweetBy?.[tweet.retweetBy.length - 1]?._id
            }`
          );
          setRetweetUsername(response.data.username);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchRetweetUsername();
  }, [retweet, currentUser, tweet?.retweetBy]);

  // Function to handle submission of a reply
  const replySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post( BASE_URL + 
        `http://localhost:5000/api/tweet/${tweet._id}/reply`,
        { content: reply },
        {
          headers: {
            Token: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      closeModal();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to open the reply modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the reply modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle liking or disliking a tweet
  const handleLikes = async () => {
    try {
      if (!isLiked) {
        const response = await axios.post( BASE_URL + 
          `http://localhost:5000/api/tweet/${tweet?._id}/like`,
          null,
          {
            headers: {
              Token: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikes(likes + 1);
        setIsLiked(true);
        toast.success("Tweet liked successfully!");
        console.log(response.data);
      } else {
        const response = await axios.post( BASE_URL + 
          `http://localhost:5000/api/tweet/${tweet?._id}/dislike`,
          null,
          {
            headers: {
              Token: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikes(likes - 1);
        setIsLiked(false);
        toast.success("Tweet disliked successfully!");
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRetweet = async () => {
    try {
      // Send a POST request to retweet a tweet
      const response = await axios.post( BASE_URL + 
        `http://localhost:5000/api/tweet/${tweet._id}/retweet`,
        null,
        {
          headers: {
            Token: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRetweet(true);
      setUpdate(response.data);
      console.log(response.data);
      toast.success("Tweet retweeted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to retweet!");
    }
  };

  const handleDelete = async () => {
    try {
      // Send a DELETE request to delete a tweet
      const response = await axios.delete( BASE_URL + 
        `http://localhost:5000/api/tweet/${tweet._id}`,
        {
          headers: {
            Token: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUpdate(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Format the creation date of the tweet
  const date = new Date(tweet?.createdAt);
  const options = {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return (
    <div className="main me-1">
      {currentUser === tweet?.tweetedBy?._id && (
        <AiOutlineDelete className="delete-btn" onClick={handleDelete} />
      )}
      <div className="container d-flex mb-3 border">
        <div className="profile-picture pe-3 pt-2">
          {tweet?.tweetedBy?.profilePicture ? (
            <img
              src={"http://localhost:5000/" + tweet?.tweetedBy?.profilePicture}
              alt="profile"
              className="profile-tweet-img"
            />
          ) : (
            <img src={profileImage} alt="dummy" className="profile-tweet-img" />
          )}
        </div>
        <div className="content d-flex flex-column">
          {retweet ? (
            <div className="retweet">
              <RiRepeatFill /> retweeted by {retweetUsername}
            </div>
          ) : null}
          <div className="detail-container d-flex align-items-center pt-2">
            <Link id="link-off"
              className="username link-default-off text-dark"
              to={"/profile/" + tweet?.tweetedBy?._id}
            >
              @{tweet?.tweetedBy?.username}
            </Link>
            <div className="time mx-2">-{formattedDate}</div>
          </div>
          <Link id="link-off" to={"/tweet/" + tweet?._id} className="link-default-off">
            <div className="w-100">
              <div className="text-content link-default-off pb-2">
                {tweet?.content}
              </div>
              <div className="tweet-img-cont">
                {tweet?.image && (
                  <img
                    src={"http://localhost:5000/" + tweet?.image}
                    alt="tweet"
                    className="tweet-img"
                  />
                )}
              </div>
            </div>
          </Link>
          <div className="button d-flex py-2">
            <div className="like pe-3">
              <button type="button" className="inv-btn " onClick={handleLikes}>
                {!isLiked ? (
                  <RiThumbUpLine className="mx-1" />
                ) : (
                  <RiThumbUpFill className="mx-1" />
                )}

                {likes}
              </button>
            </div>
            <div className="comment pe-3">
              <button type="button" className="inv-btn" onClick={openModal}>
                <RiMessage2Line className="mx-1" />
                {tweet?.replies?.length}
              </button>
              <Modal show={isModalOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Reply</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={4}
                    style={{ width: "100%", resize: "none" }}
                  ></textarea>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={replySubmit}>
                    Add Reply
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div className="retweet pe-3">
              <button type="button" className="inv-btn" onClick={handleRetweet}>
                {retweet ? (
                  <RiRepeatFill className="retweet-btn" />
                ) : (
                  <RiRepeatFill />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
