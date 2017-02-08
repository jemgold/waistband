import React, { PropTypes } from 'react';
import { evolve, take } from 'ramda';
import Instance from './Instance';
import { Instance as InstanceS } from './Shapes';

export const sterlize = evolve({
  PublicIpAddress: x => `${take(6, x)}0.123`,
  InstanceId: x => `${take(6, x)}•••••`,
});

const App = ({ instances }) =>
  <ul className="list pl0 mt0 measure center">
    { instances.map(instance =>
      <Instance {...instance} key={instance.InstanceId} />,
    )}
  </ul>;

App.propTypes = {
  instances: PropTypes.arrayOf(InstanceS).isRequired,
};

export default App;
