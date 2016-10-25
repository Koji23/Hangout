import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as authActions from '../actions/auth_actions.js';

const renderInput = field => (
  <div>
    <input {...field.input}   type={field.type} /> 
    { 
      field.meta.touched && field.meta.error && 
      <div className="error">{field.meta.error}</div>
    }
  </div>
);

class Signup extends Component {
  handleFormSubmit({ email, password}) {
    // Call action creator to sign up the user!
    // console.log( email, password, this.props.signUpUser, '...');
    this.props.signUpUser(email, password);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form className="signUp" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <h1>Sign Up</h1>
        <fieldset >
          <label>Email:</label>
          <Field name="email" component={renderInput} type="text">Email:</Field>
        </fieldset>
        <fieldset >
          <label>Password:</label>
          <Field name="password" component={renderInput} type="password">Password:</Field>
        </fieldset>
        <fieldset >
          <label>Confirm Password:</label>
          <Field name="passwordConfirm" component={renderInput} type="password">Confirm Password:</Field>
        </fieldset>
        {this.renderAlert()}
        <button action="submit">Sign up!</button>
      </form>
    );
  }
}

const validate = formProps => {
  const errors = {};

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }

  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = 'Please enter a password confirmation';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }

  return errors;
};

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  form: 'signup',
  validate,
})(connect(mapStateToProps, authActions)(Signup));
