// React
import React from 'react';
import ReactDOM from 'react-dom';
// Router
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
// Redux + Middleware
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import sampler from './middleware/sampler.js'
// Reducer 
import rootReducer from './reducers/rootReducer.js';
// HOC
import requireAuth from './hoc/requireAuth.js';
// 
import App from './components/App.jsx';
import Signin from './components/Signin.jsx';
import Resources from './components/Resources.jsx';

const Routes = (
  <Route path="/" component={ App } >
    <IndexRoute component={ Signin } />
    <Route path="/resources" component={ requireAuth(Resources) } />
  </Route>
);

const createStoreWithMiddleWare = applyMiddleware(promise, thunk, sampler, logger())(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleWare(rootReducer)} >
    <Router history={browserHistory} routes={Routes} />
  </Provider>
, document.getElementById('app'));