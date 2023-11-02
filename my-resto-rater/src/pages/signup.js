import React, { useState, useEffect } from "react";
import "./login.css";
import Axios from 'axios';

function SignUp() {
    const [name, setName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [userRole, setUserRole] = useState("reviewer");
    const [registrationMessage, setRegistrationMessage] = useState(""); // To store the message from the server
    const [redirectingMessage, setRedirectingMessage] = useState(""); // Message for auto-redirection
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
            // If registration is successful, set the redirecting message and initiate redirection
            if (response.status === 200) {
                setRedirectingMessage("Redirecting to the login page in 5 seconds...");
                setTimeout(() => {
                    setRedirectToLogin(true);
                }, 4000); // 4 seconds delay
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 400) {
                // If the status code is 400, it's a custom error message from the server
                setRegistrationMessage(error.response.data.message);
            } else {
                // Handle other client-side network errors or issues
                console.error("Registration failed:", error);
                setRegistrationMessage("Registration failed. Please try again.");
            }
        });
    };

    // Use useEffect to automatically redirect when the state variable changes
    useEffect(() => {
        if (redirectToLogin) {
            // You can use react-router or window.location to navigate to the login page
            // For example, if you're using react-router, you can use history.push('/login')
            // Here, I'll use a simple window.location.href for demonstration
            setRedirectingMessage("Redirecting to the login page...");
            setTimeout(() => {
                window.location.href = "/login"; // Redirect to the login page
            }, 1000); // 1 second delay
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
                <p>{registrationMessage}</p> {/* Display the registration message */}
                <p>{redirectingMessage}</p> {/* Display the redirecting message */}
            </div>
        </div>
    );
}

export default SignUp;
