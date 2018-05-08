import React, { Component } from 'react'  
import { reduxForm, Field } from 'redux-form'  
import { connect } from 'react-redux'

import signupRequest from './actions'
import '../App.css'

class Signup extends Component {  
  render () {
    return (
        <div className="signup">
          <form className="widget-form">
            <h1>Signup</h1>
            <label htmlFor="username">Username</label>
            <Field
              name="username"
              type="text"
              id="username"
              className="username"
              label="Username"
              component="input"
            />
            <label htmlFor="password">Password</label>
            <Field
              name="password"
              type="password"
              id="password"
              className="password"
              label="Password"
              component="input"
            />
            <button action="submit">SIGNUP</button>
          </form>
        </div>
      )  
  }
}

// Grab only the piece of state we need
const mapStateToProps = state => ({  
  signup: state.signup,
})

// Connect our component to redux and attach the `signup` piece
// of state to our `props` in the component.  Also attach the
// `signupRequest` action to our `props` as well.
const connected = connect(mapStateToProps, { signupRequest })(Signup)

// Connect our connected component to Redux Form.  It will namespace
// the form we use in this component as `signup`.
const formed = reduxForm({  
  form: 'signup',
})(connected)

// Export our well formed component!
export default formed