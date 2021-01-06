import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
// import PropTypes from 'prop-types';
import PopularitySwarmPlot from '../components/PopularitySwarmPlot';
import FollowersSwarmPlot from '../components/FollowersSwarmPlot';
import ErrorMessage from '../components/ErrorMessage';
// import Login from '../Login';
import './Home.scss';
import 'react-dropdown/style.css';
import {
  avgDuration,
  avgPopularity,
  pctExplicit, // eslint-disable-line
  avgFollowers,
  aggGenres,
} from '../services/calculations';
import { getData, createPlaylist } from '../services/base';

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
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      userData: {},
      tracksData: {
        medium: [],
      },
      artistsData: {
        medium: [],
      },
      limit: 20,
      timeRange: 'medium',
      view: 'tracks',
      waitingPlaylist: false,
      loading: true,
      authenticated: false,
    };
  }

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    this.handleUpdate();
  }

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

  handleLogoutClick = () => {
    // Logout using Twitter passport api
    // Set authenticated state to false in the HomePage
    window.open(`${BASE_URL}/auth/logout`, '_self');
    // const { handleNotAuthenticated } = this.props;
    this.setState({ loading: true, authenticated: false });
    // handleNotAuthenticated();
    // this.props.handleNotAuthenticated();
  };

  handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    // Upon successful login, a cookie session will be stored in the client
    window.open(`${BASE_URL}/auth/spotify`, '_self');
    this.setState({ loading: true });
  };

  async handleUpdate() {
    getData()
      .then((response) => {
        if (response.status === 200) return response.data;
        throw new Error('failed to authenticate user');
      })
      .then((responseJson) => {
        this.setState({
          userData: responseJson.userData,
          tracksData: responseJson.tracksData,
          artistsData: responseJson.artistsData,
          loading: false,
          authenticated: true,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Failed to authenticate user',
          loading: false,
          authenticated: false,
        });
      });
  }

  async onClickCreatePlaylist() {
    await this.setState({ waitingPlaylist: true });
    const { tracksData, timeRange, limit } = this.state;
    createPlaylist(tracksData, timeRange, limit)
      .then((response) => {
        if (response.status === 200) alert('Playlist successfully created!'); // eslint-disable-next-line
        this.setState({
          waitingPlaylist: false,
        });
      })
      .catch((err) => {
        alert('Error when creating playlist'); // eslint-disable-next-line
        console.log(err);
        this.setState({
          waitingPlaylist: false,
        });
      });
  }

  render() {
    const {
      userData,
      artistsData,
      tracksData,
      view,
      timeRange,
      limit,
      waitingPlaylist,
      error,
      loading,
      authenticated,
    } = this.state;
    const tracks = tracksData[timeRange].slice(0, limit);
    const artists = artistsData[timeRange].slice(0, limit);
    return (
      <>
        {loading && <div>Loading...</div>}
        {!loading && authenticated && (
          <div className="big-wrapper">
            <div className="home-page">
              <div className="sub-wrapper">
                <h2>{`Welcome ${userData.display_name}!`}</h2>
                <div id="select-bar">
                  <div className="sub-select">
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
                  </div>
                  <div className="sub-select">
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
                </div>
                {view === 'artists' ? (
                  <div className="data">
                    <div className="plot-container">
                      <p className="averages">{`Average popularity: ${avgPopularity(
                        artists
                      )}`}</p>
                      <div className="swarmplot">
                        <PopularitySwarmPlot data={artists} isTracks="false" />
                      </div>
                      <p className="averages">{`Average followers: ${avgFollowers(
                        artists
                      )}`}</p>
                      <div className="swarmplot">
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
                  <div className="data">
                    <div className="plot-container">
                      <p className="averages">{`Average popularity: ${avgPopularity(
                        tracks
                      )}`}</p>
                      <div className="swarmplot">
                        <PopularitySwarmPlot data={tracks} isTracks="true" />
                      </div>
                      <p className="averages">{`Average duration: ${avgDuration(
                        tracks
                      )} minutes`}</p>
                      <div className="swarmplot">
                        <FollowersSwarmPlot data={tracks} isTracks="true" />
                      </div>
                      {/* <p>{`Percent explicit: ${pctExplicit(tracks)}`}</p> */}
                    </div>
                    <div>
                      <p>Tracks</p>
                      <ol>
                        {tracks.map((x) => (
                          <li
                            key={`track-${x.name}`}
                            className={`${x.explicit}`}
                          >
                            <span className="track-name">{x.name}</span>

                            <span className="track-artist">
                              {` - `}
                              {x.artists
                                .map((artist) => artist.name)
                                .join(', ')}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="create-container">
                      <button
                        type="button"
                        onClick={() => this.onClickCreatePlaylist()}
                        id="create"
                        disabled={waitingPlaylist}
                      >
                        {/* {loading && (
                        <i
                          className="fa fa-refresh fa-spin"
                          style={{ marginRight: '5px' }}
                        />
                      )} */}
                        {waitingPlaylist && (
                          <span className="create-text">
                            Creating Playlist...
                          </span>
                        )}
                        {!waitingPlaylist && (
                          <span className="create-text button-text">
                            Create Playlist
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                <button
                  id="logout"
                  type="button"
                  className="log"
                  onClick={this.handleLogoutClick}
                >
                  <span className="button-text">LOGOUT</span>
                </button>
              </div>
            </div>

            <ErrorMessage message={error} />
          </div>
        )}
        {!loading && !authenticated && (
          <div className="big-wrapper">
            <h1>Spotify Unwrapped</h1>
            <button
              id="login"
              type="button"
              className="log"
              onClick={this.handleSignInClick}
            >
              <span className="button-text">LOGIN</span>
            </button>
          </div>
        )}
      </>
    );
  }
}

// Home.propTypes = {
//   authenticated: PropTypes.bool.isRequired,
//   handleAuthenticated: PropTypes.func.isRequired,
//   handleNotAuthenticated: PropTypes.func.isRequired,
// };
