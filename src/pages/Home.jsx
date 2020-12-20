// import API from '../services/base';
import React, { Component } from 'react';
import Header from '../components/Header';
import './Home.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // error: null,
      authenticated: false,
      userData: {},
      tracksData: {},
      artistsData: {},
      limit: 20,
      timeRange: 'medium_term',
    };
  }

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    const { limit, timeRange } = this.state;
    const data = { limit, timeRange };
    console.log(data);
    fetch('http://localhost:8888/auth/login/success', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error('failed to authenticate user');
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          authenticated: true,
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
    const { authenticated, userData, artistsData, tracksData } = this.state;
    const { tracks } = tracksData;
    const { artists, aggGenres } = artistsData;
    return (
      <div className="big-wrapper">
        <Header
          authenticated={authenticated}
          handleNotAuthenticated={this.handleNotAuthenticated}
        />
        <div>
          {!authenticated ? (
            <h1>Spotify Habits</h1>
          ) : (
            <div className="big-wrapper">
              {/* <h1>You have login succcessfully!</h1> */}
              <h2>{`Welcome ${userData.display_name}!`}</h2>
              {/* <h3>{`Followers: ${userData.followers.total}`}</h3> */}
              <img alt="profile" src={userData.images[0].url} style={{ width: '100px' }} />
              <div>
                <h3>Artists</h3>
                <div>
                  <p>{`Top artists average followers: ${artistsData.avgFollowers}`}</p>
                  <p>{`Top artists average popularity: ${artistsData.avgPopularity}`}</p>
                </div>
                <div>
                  <p>Top Genres</p>
                  <ol>
                    {aggGenres.slice(0, 5).map((genre) => (
                      <li key={`${genre[0]}`}>{`${genre[0]}  ${genre[1]}`}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p>Top Artists</p>
                  <ol>
                    {artists.map((x) => (
                      // <li
                      //   key={`artist-${x.name}`}
                      // >{`${x.name}    ${x.followers.total}   ${x.popularity} ${x.genres}`}</li>
                      <li key={`artist-${x.name}`}>{`${x.name}`}</li>
                    ))}
                  </ol>
                </div>
              </div>
              <div>
                <h3>Tracks</h3>
                <div>
                  <p>{`Top tracks average duration: ${tracksData.avgDuration}`}</p>
                  <p>{`Top tracks average popularity: ${tracksData.avgPopularity}`}</p>
                  <p>{`Top tracks percent explicit: ${tracksData.pctExplicit}`}</p>
                </div>
                <div>
                  <p>Top tracks</p>
                  <ol>
                    {tracks.map((x) => (
                      // <li
                      //   key={`track-${x.name}`}
                      //   className={`${x.explicit}`}
                      // >{`${x.name} - ${x.artists[0].name}
                      // ${x.duration_ms}    ${x.explicit}    ${x.popularity}`}</li>
                      <li
                        key={`track-${x.name}`}
                        className={`${x.explicit}`}
                      >{`${x.name} - ${x.artists[0].name}`}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
