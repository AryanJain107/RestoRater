import React, { useState, useEffect } from "react";
import "./login.css";
import Axios from 'axios';

function SignUp() {
    const [name, setName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [userRole, setUserRole] = useState("reviewer");
    const [registrationMessage, setRegistrationMessage] = useState("");
    const [redirectingMessage, setRedirectingMessage] = useState("");
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const register = () => {
        Axios.post("http://localhost:3001/register", {
            name: name,
            email: userEmail,
            password: passwordReg,
            role: userRole,
        })
        .then((response) => {
            setRegistrationMessage(response.data.message);
            if (response.status === 200) {
                setRedirectingMessage("Redirecting to the login page in 5 seconds...");
                setTimeout(() => {
                    setRedirectToLogin(true);
                }, 4000);
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 400) {
                setRegistrationMessage(error.response.data.message);
            } else {
                console.error("Registration failed:", error);
                setRegistrationMessage("Registration failed. Please try again.");
            }
        });
    };

    useEffect(() => {
        if (redirectToLogin) {
            setRedirectingMessage("Redirecting to the login page...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }
    }, [redirectToLogin]);

    return (
        <div className="App">
            <div className="registration">
                <h1>Registration</h1>
                <label>Name</label>
                <input
                    type="text"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                /><br />
                <label>Email</label>
                <input
                    type="text"
                    onChange={(e) => {
                        setUserEmail(e.target.value);
                    }}
                /><br />
                <label>Password</label>
                <input
                    type="text"
                    onChange={(e) => {
                        setPasswordReg(e.target.value);
                    }}
                /> <br />
                <label>Choose Your Role:</label>
                <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                >
                    <option value="reviewer">Reviewer</option>
                    <option value="owner">Owner</option>
                </select>
                <br />
                <button onClick={register}>Register</button>
                <p>{registrationMessage}</p>
                <p>{redirectingMessage}</p>
            </div>
        </div>
    );
}

export default SignUp;
