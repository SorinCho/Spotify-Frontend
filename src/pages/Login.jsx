import React from 'react';

const handleSignInClick = () => {
  // Authenticate using via passport api in the backend
  // Open Twitter login page
  // Upon successful login, a cookie session will be stored in the client
  window.open('http://localhost:8888/auth/spotify', '_self');
};

const Login = () => (
  <div className="big-wrapper">
    <h1>Spotify Unwrapped</h1>
    <button id="login" type="button" onClick={handleSignInClick}>
      Login
    </button>
  </div>
);
export default Login;
