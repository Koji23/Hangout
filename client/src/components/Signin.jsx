import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field} from 'redux-form';
import * as authActions from '../actions/auth_actions.js';

// RFv6...Define stateless component to render input and errors in Field
// type prop is passed in via Field (below)
const renderInput = field => (
  <div>
    <input {...field.input}   type={field.type} /> 
    {
      field.meta.touched && field.meta.error && 
      <span className="error">{field.meta.error}</span>
    }
  </div>
);

class Signin extends Component {
  handleFormSubmit({ email, password }) {
    // console.log(email, password);
    this.props.signInUser(email, password);
  }
  render () {
    const { handleSubmit } = this.props; // v6...no fields prop

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset>
          <label htmlFor="email">Email:</label>
          <Field name="email" component={renderInput} type="text"/>
        </fieldset>
        <fieldset>
          <label htmlFor="password">Password:</label>
          <Field name="password" component={renderInput} type="password"/>
        </fieldset>
        <button action="submit">Sign In</button>
      </form>
    );
  }
}

const validate = formProps => {
  const errors = {};

  if(!formProps.email) {
    errors.email = 'Please enter an email';
  }
  if(!formProps.password) {
    errors.password = 'Please enter a password';
  }
  return errors;
};

// const warn = formProps => {
//   const warnings = {};
//   if(formProps.password && formProps.password.length < 6) {
//     warnings.password = 'Password is a little short';
//   }
// };

export default reduxForm({
  form: 'signin',
  validate,

})(connect(null, authActions)(Signin));