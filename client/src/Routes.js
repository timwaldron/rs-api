import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Docs from './components/Docs';
import Examples from './components/Examples';
import Contact from './components/Contact';
import NoMatch from './components/NoMatch';

export default class Routes extends React.Component {

  render = () => {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/docs" component={Docs} />
        <Route path="/examples" component={Examples} />
        <Route path="/contact" component={Contact} />
        <Route component={NoMatch} />
      </Switch>
    );
  }
}