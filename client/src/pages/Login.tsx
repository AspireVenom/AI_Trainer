import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/app");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>LET AI boost-start your Fitness</h1>
        <p>
          Kickstart your workout journey with personalized routines built by AI.
        </p>

        <button onClick={handleGoogleLogin}>Sign in with Google!</button>

        <p className="note">No account needed — just use your Google login.</p>
      </div>
    </div>
  );
}

export default Login;
