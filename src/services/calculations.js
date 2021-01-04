function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function avgDuration(tracks) {
  const total = tracks.reduce((sum, { duration_ms }) => sum + duration_ms, 0); //eslint-disable-line
  return round(total / tracks.length / 60000);
}

export function pctExplicit(tracks) {
  const total = tracks.filter((track) => track.explicit === true).length;
  return round(total / tracks.length);
}

export function avgFollowers(artists) {
  const total = artists.reduce(
    (sum, { followers }) => sum + followers.total,
    0
  );
  return round(total / artists.length);
}

export function avgPopularity(artists) {
  const total = artists.reduce((sum, { popularity }) => sum + popularity, 0);
  return round(total / artists.length);
}

export function aggGenres(artists) {
  const counts = {};
  artists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      counts[genre] = counts[genre] ? counts[genre] + 1 : 1;
    });
  });
  const sortable = [];
  // counts.forEach((genre) => sortable.push([genre, counts[genre]]));
  Object.keys(counts).forEach((genre) => sortable.push([genre, counts[genre]]));
  // for (const genre in Object.keys(counts)) {
  //   sortable.push([genre, counts[genre]]);
  // }
  sortable.sort((a, b) => b[1] - a[1]);
  return sortable;
}
