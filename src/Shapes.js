/* eslint-disable import/prefer-default-export */
import { PropTypes } from 'react';
import { values } from 'ramda';
import { states } from './shared/ec2Utils';

export const Instance = {
  State: PropTypes.shape({
    Name: PropTypes.oneOf(values(states)),
  }).isRequired,
  PublicIpAddress: PropTypes.string.isRequired,
  InstanceType: PropTypes.string.isRequired,
  InstanceId: PropTypes.string.isRequired,
};
