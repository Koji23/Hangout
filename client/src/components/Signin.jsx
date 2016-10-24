import React, { Component } from 'react';
import { reduxForm, Field} from 'redux-form';

// v6...Define stateless component to render input and errors in Field
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
    console.log(email, password);
    //
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

export default reduxForm({
  form: 'signin',
  fields: ['email', 'password'],
})(Signin);