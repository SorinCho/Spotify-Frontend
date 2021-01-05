import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // headers: { 'Access-Control-Allow-Origin': '*' },
});

export async function getData() {
  return instance.get('/auth/login/success', {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true,
    },
  });
}

export async function createPlaylist(tracksData, timeRange, limit) {
  const tracks = tracksData[timeRange].slice(0, limit);
  const uris = tracks.map((track) => track.uri);
  const data = { timeRange, tracks: uris };
  return instance.post('/auth/createTracksPlaylist', data, {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true,
    },
  });
}
