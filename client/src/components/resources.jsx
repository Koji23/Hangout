import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as authActions from '../actions/auth_actions.js';

class Resource extends Component {
  componentWillMount() {
    this.props.fetchMessage();
  }

  render() {
    return (
      <div>{this.props.message}</div>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, authActions)(Resource);
