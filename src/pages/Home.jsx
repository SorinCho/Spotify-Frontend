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
      tracksData: {},
      artistsData: {},
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
          tracksData: responseJson.tracksData,
          artistsData: responseJson.artistsData,
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
    const { authenticated, userData, artistsData, tracksData, user } = this.state;
    const { tracks } = tracksData;
    const { artists, aggGenres } = artistsData;
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
              <p>{`Top artists average followers: ${artistsData.avgFollowers}`}</p>
              <p>{`Top artists average popularity: ${artistsData.avgPopularity}`}</p>
              <div>
                <p>Top Genres</p>
                <ol>
                  {aggGenres.slice(0, 5).map((genre) => (
                    <li key={`${genre[0]}`}>{`${genre[0]}  ${genre[1]}`}</li>
                  ))}
                </ol>
              </div>
              <ol>
                {artists.map((x) => (
                  <li
                    key={`artist-${x.name}`}
                  >{`${x.name}    ${x.followers.total}   ${x.popularity}    ${x.genres}`}</li>
                ))}
              </ol>
              <p>{`Top tracks average duration: ${tracksData.avgDuration}`}</p>
              <p>{`Top tracks average popularity: ${tracksData.avgPopularity}`}</p>
              <p>{`Top tracks percent explicit: ${tracksData.pctExplicit}`}</p>
              <ol>
                {tracks.map((x) => (
                  <li
                    key={`track-${x.name}`}
                  >{`${x.name} - ${x.artists[0].name}    ${x.duration_ms}    ${x.explicit}    ${x.popularity}`}</li>
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
