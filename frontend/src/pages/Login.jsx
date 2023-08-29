import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../config";
import "react-toastify/dist/ReactToastify.css";
import { RiQuestionAnswerFill } from "react-icons/ri";
import '../App.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your login API endpoint with email and password
      const response = await axios.post( BASE_URL + 
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // Store user data and token in localStorage
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      toast.success("Login successful!");

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      // Display error message
      console.log(error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 vw-100">
      <div className="d-flex border rounded">
        <div className="d-flex flex-column justify-content-center align-items-center rounded-start login-col-1">
          <h2 className="text-light px-4 login-welcome-font">Welcome back</h2>
          <RiQuestionAnswerFill className="w-25 h-25 mb-3 text-light"/>
        </div>
        <div className="px-5 my-5 d-flex flex-column justify-content-center ">
          <h2 className="fw-bold">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group ">
              <input
                type="email"
                className="form-control my-3"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group ">
              <input
                type="password"
                className="form-control my-3"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          <span className="my-3"> 
            Don't have an account?  
            <Link id="link-off" to='/register'>Register here</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
