import React, { useState } from "react";
import "./login.css";
import Axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const login = () => {
    Axios.post("http://localhost:3001/login", {
      email: email,
      password: password,
    })
      .then((response) => {
        if (response.data && !response.data.message) {
          setLoginStatus("Login successful");
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
        <button onClick={login}>Login</button>
      </div>
      <h1>{loginStatus}</h1>
    </div>
  );
}

export default Login;
