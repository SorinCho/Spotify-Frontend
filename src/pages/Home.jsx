// import API from '../services/base';
import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import Header from '../components/Header';
import './Home.scss';

import 'react-dropdown/style.css';

const viewOptions = [
  { value: 'tracks', label: 'Tracks' },
  { value: 'artists', label: 'Artists' },
];
const limitOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];
const timeOptions = [
  { value: 'short_term', label: '1 month' },
  { value: 'medium_term', label: '3 months' },
  { value: 'long_term', label: '6 months' },
];

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
      view: 'tracks',
    };
  }

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    this.handleUpdate();
  }

  handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };

  handleLimitClick(limit) {
    const { value } = limit;
    this.setState({ limit: value }, this.handleUpdate);
  }

  handleTimeRangeClick(timeRange) {
    const { value } = timeRange;
    this.setState({ timeRange: value }, this.handleUpdate);
  }

  handleViewClick(view) {
    const { value } = view;
    this.setState({ view: value }, this.handleUpdate);
  }

  handleUpdate() {
    const { limit, timeRange, view } = this.state;
    const data = { limit, timeRange, view };
    // console.log(data);
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
        // console.log(responseJson);
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

  render() {
    const {
      authenticated,
      userData,
      artistsData,
      tracksData,
      view,
    } = this.state;
    const { tracks } = tracksData;
    const { artists, aggGenres } = artistsData;
    return (
      <div className="big-wrapper">
        <div>
          {!authenticated ? (
            <h1>Spotify Habits</h1>
          ) : (
            <div className="big-wrapper">
              {/* <h1>You have login succcessfully!</h1> */}
              <h2>{`Welcome ${userData.display_name}!`}</h2>
              {/* <h3>{`Followers: ${userData.followers.total}`}</h3> */}
              <img
                alt="profile"
                src={userData.images[0].url}
                style={{ width: '100px' }}
              />
              <div id="select-bar">
                <div className="select-text">Top</div>
                <Dropdown
                  options={limitOptions}
                  value={limitOptions[1]}
                  onChange={(e) => this.handleLimitClick(e)}
                  placeholder="Select an option"
                />
                <Dropdown
                  options={viewOptions}
                  value={viewOptions[0]}
                  onChange={(e) => this.handleViewClick(e)}
                  placeholder="Select an option"
                />
                <div className="select-text">Last</div>
                <Dropdown
                  options={timeOptions}
                  value={timeOptions[1]}
                  onChange={(e) => this.handleTimeRangeClick(e)}
                  placeholder="Select an option"
                />
              </div>
              {view === 'artists' ? (
                <div>
                  <div>
                    <ol>
                      {artists.map((x) => (
                        // <li
                        //   key={`artist-${x.name}`}
                        // >{`${x.name}    ${x.followers.total}   ${x.popularity} ${x.genres}`}</li>
                        <li key={`artist-${x.name}`}>{`${x.name}`}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <p>{`Average followers: ${artistsData.avgFollowers}`}</p>
                    <p>{`Average popularity: ${artistsData.avgPopularity}`}</p>
                  </div>
                  <div>
                    <p>Top Genres</p>
                    <ol>
                      {aggGenres.slice(0, 5).map((genre) => (
                        <li
                          key={`${genre[0]}`}
                        >{`${genre[0]}  ${genre[1]}`}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
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
                  <div>
                    <p>{`Average duration: ${tracksData.avgDuration}`}</p>
                    <p>{`Average popularity: ${tracksData.avgPopularity}`}</p>
                    <p>{`Percent explicit: ${tracksData.pctExplicit}`}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Header
          authenticated={authenticated}
          handleNotAuthenticated={this.handleNotAuthenticated}
        />
      </div>
    );
  }
}
