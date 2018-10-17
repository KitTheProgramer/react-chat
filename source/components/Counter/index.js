// Core
import React from 'react';
import { number } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

export const Counter = ({ count }) => (
    <section className = { Styles.counter }>Posts count: {count}</section>
);

Counter.propTypes = {
    count: number.isRequired,
};

Counter.defaultProps = {
    count: 0,
};
