import React from 'react';
import { ResponsiveSwarmPlot } from '@nivo/swarmplot';
import PropTypes from 'prop-types';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const process = (data) => {
  const limit = data.length;
  return data.map((track, i) => ({
    id: track.name,
    group: 'Track',
    duration: track.duration_ms,
    volume: ((limit - i) / limit) * 30,
  }));
};
const DurationSwarmPlot = ({ data }) => (
  <ResponsiveSwarmPlot
    data={process(data)}
    groups={['Track']}
    value="duration"
    valueFormat="d"
    valueScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: false }}
    size={{ key: 'volume', values: [4, 20], sizes: [6, 20] }}
    layout="horizontal"
    simulationIterations={100}
    borderColor={{
      from: 'color',
      modifiers: [
        ['darker', 0.6],
        ['opacity', 0.5],
      ],
    }}
    margin={{ top: 80, right: 100, bottom: 80, left: 100 }}
    axisBottom={{
      orient: 'bottom',
      tickSize: 10,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Duration',
      legendPosition: 'middle',
      legendOffset: 46,
    }}
    motionStiffness={50}
    motionDamping={10}
  />
);

DurationSwarmPlot.propTypes = {
  data: PropTypes.array, // eslint-disable-line
};

export default DurationSwarmPlot;