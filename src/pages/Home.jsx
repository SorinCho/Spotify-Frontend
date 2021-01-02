import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import Header from '../components/Header';
import PopularitySwarmPlot from '../components/PopularitySwarmPlot';
import FollowersSwarmPlot from '../components/FollowersSwarmPlot';
import './Home.scss';
import 'react-dropdown/style.css';
import {
  avgDuration,
  avgPopularity,
  pctExplicit,
  avgFollowers,
  aggGenres,
} from '../services/calculations';

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
  { value: 'short', label: '1 month' },
  { value: 'medium', label: '6 months' },
  { value: 'long', label: 'All Time' },
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
      timeRange: 'medium',
      view: 'tracks',
      waiting: false,
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
    this.setState({ limit: value });
  }

  handleTimeRangeClick(timeRange) {
    const { value } = timeRange;
    this.setState({ timeRange: value });
  }

  handleViewClick(view) {
    const { value } = view;
    this.setState({ view: value });
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

  async onClickCreatePlaylist() {
    await this.setState({ waiting: true });
    const { waiting, tracksData, timeRange } = this.state;
    console.log(waiting);
    const tracks = tracksData[timeRange];
    const uris = tracks.map((track) => track.uri);
    const data = { timeRange: 0, tracks: uris };
    fetch('http://localhost:8888/auth/createTracksPlaylist', {
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
        if (response.status === 200) alert('Playlist successfully created!');
        this.setState({
          waiting: false,
        });
      })
      .catch(() => {
        alert('Error when creating playlist');
        this.setState({
          waiting: false,
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
      timeRange,
    } = this.state;
    const tracks = tracksData[timeRange];
    const artists = artistsData[timeRange];
    console.log(tracks);
    return (
      <div className="big-wrapper">
        <div>
          {!authenticated ? (
            <h1>Spotify Unwrapped</h1>
          ) : (
            <div className="big-wrapper">
              {/* <h1>You have login succcessfully!</h1> */}
              <h2>{`Welcome ${userData.display_name}!`}</h2>
              {/* <h3>{`Followers: ${userData.followers.total}`}</h3> */}
              <img
                alt="profile"
                src={userData.images[0].url}
                style={{ width: '0px' }}
              />
              <div id="select-bar">
                <div className="select-text">Top</div>
                <Dropdown
                  options={limitOptions}
                  value={limitOptions[1]}
                  onChange={(e) => this.handleLimitClick(e)}
                  placeholder="Select an option"
                  className="dropdown-class"
                  controlClassName="dropdown-control"
                  placeholderClassName="dropdown-placeholder"
                  menuClassName="dropdown-menu"
                  arrowClassName="dropdown"
                  arrowClosed={<span className="arrow-closed" />}
                  arrowOpen={<span className="arrow-open" />}
                />
                <Dropdown
                  options={viewOptions}
                  value={viewOptions[0]}
                  onChange={(e) => this.handleViewClick(e)}
                  placeholder="Select an option"
                  className="dropdown-class"
                  controlClassName="dropdown-control"
                  placeholderClassName="dropdown-placeholder"
                  menuClassName="dropdown-menu"
                  arrowClassName="dropdown"
                  arrowClosed={<span className="arrow-closed" />}
                  arrowOpen={<span className="arrow-open" />}
                />
                <div className="select-text">Last</div>
                <Dropdown
                  options={timeOptions}
                  value={timeOptions[1]}
                  onChange={(e) => this.handleTimeRangeClick(e)}
                  placeholder="Select an option"
                  className="dropdown-class"
                  controlClassName="dropdown-control dropdown-control-limit"
                  placeholderClassName="dropdown-placeholder"
                  menuClassName="dropdown-menu"
                  arrowClassName="dropdown"
                  arrowClosed={<span className="arrow-closed" />}
                  arrowOpen={<span className="arrow-open" />}
                />
              </div>
              {view === 'artists' ? (
                <div>
                  <div>
                    <p>{`Average popularity: ${avgPopularity(artists)}`}</p>
                    <div style={{ height: '300px', width: '700px' }}>
                      <PopularitySwarmPlot data={artists} isTracks="false" />
                    </div>
                    <p>{`Average followers: ${avgFollowers(artists)}`}</p>
                    <div style={{ height: '300px', width: '700px' }}>
                      <FollowersSwarmPlot data={artists} isTracks="false" />
                    </div>
                  </div>
                  <div>
                    <p>Top Genres</p>
                    <ol>
                      {aggGenres(artists)
                        .slice(0, 5)
                        .map((genre) => (
                          <li key={`${genre[0]}`}>{`${genre[0]}`}</li> // ${genre[1]}
                        ))}
                    </ol>
                  </div>
                  <div>
                    <p>Artists</p>
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
              ) : (
                <div>
                  <div>
                    <p>{`Average popularity: ${avgPopularity(tracks)}`}</p>
                    <div style={{ height: '300px', width: '700px' }}>
                      <PopularitySwarmPlot data={tracks} isTracks="true" />
                    </div>
                    <p>{`Average duration: ${avgDuration(tracks)}`}</p>
                    <div style={{ height: '300px', width: '700px' }}>
                      <FollowersSwarmPlot data={tracks} isTracks="true" />
                    </div>
                    {/* <p>{`Percent explicit: ${pctExplicit(tracks)}`}</p> */}
                  </div>
                  <div>
                    <p>Tracks</p>
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
                        >{`${x.name} - ${x.artists
                          .map((artist) => artist.name)
                          .join(', ')}`}</li>
                      ))}
                    </ol>
                    <button
                      type="button"
                      onClick={() => this.onClickCreatePlaylist()}
                      id="create"
                      disabled={waiting}
                    >
                      {/* {loading && (
                        <i
                          className="fa fa-refresh fa-spin"
                          style={{ marginRight: '5px' }}
                        />
                      )} */}
                      {waiting && <span>Creating Playlist...</span>}
                      {!waiting && <span>Create Playlist</span>}
                    </button>
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
