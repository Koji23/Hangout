// React
import React from 'react';
import ReactDOM from 'react-dom';
// Router
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
// Redux + Middleware
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import sampler from './middleware/sampler.js'
// Reducer 
import rootReducer from './reducers/rootReducer.js';
// HOC
import requireAuth from './hoc/requireAuth.js';
// Component
import App from './components/App.jsx';
import Signin from './components/Signin.jsx';
import Signup from './components/Signup.jsx';
import Signout from './components/Signout.jsx';
import Welcome from './components/Welcome.jsx';
import ProfilePicture from './components/ProfilePicture.jsx';
import Resource from './components/resources.jsx';

// Action Types
import { AUTH_USER } from './actions/auth_actions.js';

// Initialize store early so we can attempt to 
const createStoreWithMiddleWare = applyMiddleware(promise, thunk, sampler, logger())(createStore);
const store = createStoreWithMiddleWare(rootReducer);

const token = localStorage.getItem('token');
if(token) {
  store.dispatch({ type: AUTH_USER });
}

const Routes = (
  <Route path="/" component={ App } >
    <IndexRoute component={ Welcome } />
    <Route path="signin" component={ Signin } />
    <Route path="signup" component={ Signup } />
    <Route path="signout" component={ Signout } />
    <Route path="/profilepic" component={ requireAuth(ProfilePicture) } />
    <Route path="/resource" component={ Resource } />
  </Route>
);


ReactDOM.render(
  <Provider store={store} >
    <Router history={browserHistory} routes={Routes} />
  </Provider>
, document.getElementById('app'));