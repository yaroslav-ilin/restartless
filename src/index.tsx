import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';

import { NoMatchPage } from './404Page';
import { CategoryPage } from './CategoryPage';
import { HomePage } from './HomePage';

render(
  <BrowserRouter>
    <Switch>
      <Route path='/' exact={true} component={HomePage}/>
      <Route path='/category/:category' component={CategoryPage}/>
      <Route component={NoMatchPage} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('react-root'),
);
