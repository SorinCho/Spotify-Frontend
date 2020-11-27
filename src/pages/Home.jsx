// import API from '../services/base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      // error: null,
      authenticated: false,
      userData: {},
      topTracks: [],
      topArtists: [],
    };
  }

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    fetch('http://localhost:8888/auth/login/success', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error('failed to authenticate user');
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          authenticated: true,
          user: responseJson.user,
          userData: responseJson.userData,
          topTracks: responseJson.topTracks,
          topArtists: responseJson.topArtists,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          authenticated: false,
          // error: 'Failed to authenticate user',
        });
      });
  }

  handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };

  render() {
    const { authenticated, userData, topArtists, topTracks, user } = this.state;
    return (
      <div>
        <Header
          authenticated={authenticated}
          handleNotAuthenticated={this.handleNotAuthenticated}
        />
        <div>
          {!authenticated ? (
            <h1>Welcome!</h1>
          ) : (
            <div>
              <h1>You have login succcessfully!</h1>
              <h2>{`Welcome ${userData.display_name}!`}</h2>
              <h2>{`id: ${user.spotifyId}`}</h2>
              <h3>{`Followers: ${userData.followers.total}`}</h3>
              <img alt="profile" src={userData.images[0].url} />
              <ol>
                {topArtists.map((x) => (
                  <li key={`artist-${x.name}`}>{x.name}</li>
                ))}
              </ol>
              <ol>
                {topTracks.map((x) => (
                  <li key={`track-${x.name}`}>{`${x.name} - ${x.artists[0].name}`}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  user: PropTypes.shape({
    spotifyId: PropTypes.string,
    _id: PropTypes.string,
  }),
};

Home.defaultProps = {
  user: { spotifyId: '', _id: '' },
};
