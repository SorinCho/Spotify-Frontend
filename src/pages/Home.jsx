import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import PropTypes from 'prop-types';
import PopularitySwarmPlot from '../components/PopularitySwarmPlot';
import FollowersSwarmPlot from '../components/FollowersSwarmPlot';
import ErrorMessage from '../components/ErrorMessage';
import './Home.scss';
import 'react-dropdown/style.css';
import {
  avgDuration,
  avgPopularity,
  pctExplicit, // eslint-disable-line
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

  async handleUpdate() {
    const { handleNotAuthenticated, handleAuthenticated } = this.props;
    fetch('http://localhost:8888/auth/login/success', {
      method: 'POST',
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
        // console.log(responseJson);
        handleAuthenticated();
        this.setState({
          userData: responseJson.userData,
          tracksData: responseJson.tracksData,
          artistsData: responseJson.artistsData,
        });
      })
      .catch(() => {
        handleNotAuthenticated();
        this.setState({
          error: 'Failed to authenticate user',
        });
      });
  }

  async onClickCreatePlaylist() {
    await this.setState({ waitingPlaylist: true });
    const { tracksData, timeRange, limit } = this.state;
    const tracks = tracksData[timeRange].slice(0, limit);
    const uris = tracks.map((track) => track.uri);
    const data = { timeRange, tracks: uris };
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
          waitingPlaylist: false,
        });
      })
      .catch(() => {
        alert('Error when creating playlist');
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
    } = this.state;
    const tracks = tracksData[timeRange].slice(0, limit);
    const artists = artistsData[timeRange].slice(0, limit);
    return (
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
                      <li key={`track-${x.name}`} className={`${x.explicit}`}>
                        <span className="track-name">{x.name}</span>

                        <span className="track-artist">
                          {` - `}
                          {x.artists.map((artist) => artist.name).join(', ')}
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
                    {waitingPlaylist && <span>Creating Playlist...</span>}
                    {!waitingPlaylist && <span>Create Playlist</span>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }
}

Home.propTypes = {
  handleAuthenticated: PropTypes.func.isRequired,
  handleNotAuthenticated: PropTypes.func.isRequired,
};
