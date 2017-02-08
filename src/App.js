import React, { Component } from 'react';
import { evolve, take } from 'ramda';
import Instance from './Instance';

const sterlize = evolve({
  PublicIpAddress: x => `${take(6, x)}0.123`,
  InstanceId: x => `${take(6, x)}•••••`,
});

class App extends Component {
  render() {
    return (
      <ul className="list pl0 mt0 measure center">
        { this.props.instances.map(instance =>
          <Instance {...instance} key={instance.InstanceId} />
        )}
      </ul>
    );
  }
}

export default App;
