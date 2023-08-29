import React, { useEffect, useState } from "react";
import "../App.css";
import Sidebar from "../components/sidebar";
import Tweet from "../components/Tweet";
import { useParams } from "react-router-dom";
import { publicRequest } from "../requestMethod";
const TweetReply = () => {
  const { id } = useParams();

  // State variables
  const [tweet, setTweet] = useState();
  const [replies, setReplies] = useState([]);
  const [update, setUpdate] = useState("");
  const currentUserId = JSON.parse(localStorage.getItem("userData"))?._id;

  // Fetch tweet and replies data
  useEffect(() => {
    const getTweet = async () => {
      try {
        // Fetch tweet data
        const res = await publicRequest.get("/tweet/" + id);
        setTweet(res.data);
        setReplies(res.data.replies);
      } catch (err) {
        console.log(err);
      }
    };
    getTweet();
  }, [id, update]);

  return (
    <div className="container d-flex  vw-100 vh-100  justify-content-center align-items-center">
      <div className="wrapper scroll vh-100">
        <div className="ms-0 ps-0 sidebar-cont">
          <Sidebar />
        </div>
        <div className="d-flex flex-column ps-3 scroll-on custom-scrollbar w-100">
          <div className="d-flex justify-content-between ps-1 my-1 me-1">
            <h3 className="fw-bold">Tweet</h3>
          </div>
          <Tweet tweet={tweet} key={tweet?._id} />
          <h3 className="fw-bold">Replies</h3>
          <div className="d-flex flex-column w-100">
            {replies?.map((tweet) => {
              return (
                <Tweet
                  tweet={tweet}
                  key={tweet._id}
                  setUpdate={setUpdate}
                  currentUser={currentUserId}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetReply;
