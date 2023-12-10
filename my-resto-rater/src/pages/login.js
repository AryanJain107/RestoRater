import React, { useState } from "react";
import "./login.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { useAuth } from "./AuthContext";


const OptionLink = styled(Link)`
  background-color: #007BFF;
  color: #fff;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  margin: 0 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const OptionLinkBack = styled(Link)`
  background-color: red;
  color: #fff;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  margin: 0 10px;

  &:hover {
    background-color: #b30000;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const logIn = () => {
    Axios.post("http://localhost:3001/login", {
      email: email,
      password: password,
    })
      .then((response) => {
        if (response.data && !response.data.message) {
          console.log(response.data[0])
          setLoginStatus("Login successful");
          login(response.data[0]);
          navigate("/homepage");
        } else if (response.data && response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          setLoginStatus("Unexpected response structure");
        }
      })
      .catch((error) => {
        setLoginStatus("An error occurred while logging in.");
      });
  };

  return (
    <div className="App">
      <div className="login">
      <h1>Login</h1>
        <label>Email</label>
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <label>Password</label>
        <input
          type="text"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />{" "}
        <br />
        {/* <button onClick={login}>Login</button> */}
        <OptionLink onClick={logIn} to="/login">Login</OptionLink>
        <div style={{ marginTop: "20px" }}>
          <OptionLinkBack to="/">Go Back</OptionLinkBack>
        </div>
      </div>
      <p>{loginStatus}</p>
    </div>
  );
}

export default Login;
