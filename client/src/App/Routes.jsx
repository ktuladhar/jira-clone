import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';
import { getStoredAuthToken } from 'shared/utils/authToken';

const isAuthenticated = () => Boolean(getStoredAuthToken());

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to={isAuthenticated() ? '/project' : '/authenticate'} />
      <Route path="/authenticate" component={Authenticate} />
      <Route
        path="/project"
        render={() => (isAuthenticated() ? <Project /> : <Redirect to="/authenticate" />)}
      />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
