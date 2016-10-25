import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Header extends Component {
  renderLinks() {
    if (this.props.authenticated) {
      return (<li><Link to="/signout">Sign Out</Link></li>);
    } else {
      // note: returning an array of jsx elements lets you skip the wrapper div :)
      return ([
        <li key={1}>
          <Link to="/signin">Sign In</Link>
        </li>,
        <li key={2}>
          <Link to="/signup">Sign Up</Link>
        </li>
      ]); 
    }
  }

  render() {
    return (
      <nav>
        <ul>
          <li><Link to="/" >Welcome</Link></li>
          <li><Link to="/resource" >Resource</Link></li>
          {this.renderLinks()}
        </ul>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(Header);
