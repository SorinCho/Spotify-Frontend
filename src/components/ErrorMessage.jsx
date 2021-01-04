import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = (message) =>
  message ? (
    <div />
  ) : (
    <div>
      <span>{message}</span>
    </div>
  );

ErrorMessage.propTypes = {
  message: PropTypes.string, // eslint-disable-line
};

export default ErrorMessage;
