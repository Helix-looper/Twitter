import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { RiDiscussFill } from "react-icons/ri";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle input field changes
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform form validation here
    if (!name || !username || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    // Send registration data to the backend
    const registrationData = {
      name,
      username,
      email,
      password,
    };

    try {
      const response = await axios.post( BASE_URL + 
        "http://localhost:5000/api/auth/register",
        registrationData
      );
      console.log(response.data);

      // Clear form
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");

      toast.success("User registered successfully!");

      navigate("/login");
    } catch (error) {
      console.log(error);
      // Handle registration error
      toast.error("Failed to register user!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 vw-100">
      <div className="d-flex border rounded">
        <div className="d-flex flex-column justify-content-center align-items-center rounded-start login-col-1">
        <h1 className="text-light register-welcome-font">Join Us</h1>
        <RiDiscussFill className="w-25 h-25 mb-3 text-light"/>
      </div>
      <div className="px-5 my-4 d-flex flex-column justify-content-center ">
      <h2 className="fw-bold">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          className="form-control my-3"
          onChange={handleNameChange}
          placeholder="Name"
        />
        <input
          type="text"
          value={username}
          className="form-control my-3"
          onChange={handleUsernameChange}
          placeholder="Username"
        />
        <input
          type="email"
          value={email}
          className="form-control my-3"
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          className="form-control my-3"
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <button type="submit" className=" btn btn-primary my-3">Register</button>
      </form>
      <span className="my-3">
        Already have an account?
      <Link id="link-off" to='/login'>Login here</Link>
      </span>
        </div>
        
      </div>
    </div>
  );
};

export default RegistrationForm;
