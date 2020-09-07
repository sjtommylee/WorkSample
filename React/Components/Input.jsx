import React from 'react';

const Input = props => {
  return <input {...props} className={`input ${props.className}`} />;
};

export default Input;
