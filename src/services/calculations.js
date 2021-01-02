export function avgDuration(tracks) {
  const total = tracks.reduce((sum, { duration_ms }) => sum + duration_ms, 0);
  return total / tracks.length;
}

export function pctExplicit(tracks) {
  const total = tracks.filter((track) => track.explicit == true).length;
  return total / tracks.length;
}

export function avgFollowers(artists) {
  const total = artists.reduce(
    (sum, { followers }) => sum + followers.total,
    0
  );
  return total / artists.length;
}

export function avgPopularity(artists) {
  const total = artists.reduce((sum, { popularity }) => sum + popularity, 0);
  return total / artists.length;
}

export function aggGenres(artists) {
  const counts = {};
  artists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      counts[genre] = counts[genre] ? counts[genre] + 1 : 1;
    });
  });
  const sortable = [];
  for (const genre in counts) {
    sortable.push([genre, counts[genre]]);
  }
  sortable.sort((a, b) => b[1] - a[1]);
  return sortable;
}
