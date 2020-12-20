import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.scss';

export default class Header extends Component {
  handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    // Upon successful login, a cookie session will be stored in the client
    window.open('http://localhost:8888/auth/spotify', '_self');
  };

  handleLogoutClick = () => {
    // Logout using Twitter passport api
    // Set authenticated state to false in the HomePage
    window.open('http://localhost:8888/auth/logout', '_self');
    const { handleNotAuthenticated } = this.props;
    handleNotAuthenticated();
    // this.props.handleNotAuthenticated();
  };

  render() {
    const { authenticated } = this.props;
    return (
      <ul className="menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        {authenticated ? (
          <li>
            <button type="button" onClick={this.handleLogoutClick}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <button type="button" onClick={this.handleSignInClick}>
              Login
            </button>
          </li>
        )}
      </ul>
    );
  }
}

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  handleNotAuthenticated: PropTypes.func,
};
Header.defaultProps = {
  handleNotAuthenticated: null,
};
