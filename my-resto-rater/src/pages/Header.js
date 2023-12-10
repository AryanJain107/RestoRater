import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="header">
      <div className="header-left">
        {isAuthenticated && user && (
          <>
            <span>Welcome, {user.email}</span>
            <button onClick={logout}>Sign Out</button>
          </>
        )}
      </div>
      <div className="header-center">
        <h1>Restaurants</h1>
      </div>
    </div>
  );
};

export default Header;
