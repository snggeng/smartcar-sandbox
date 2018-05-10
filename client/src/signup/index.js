import React, { Component } from 'react'  
import PropTypes from 'prop-types'
import { reduxForm, Field, clearSubmitErrors, reset } from 'redux-form'  
import { connect } from 'react-redux'  
import { Link } from 'react-router-dom'
import { Button, Card, Elevation, Classes, Colors, Callout, FormGroup } from "@blueprintjs/core"

// Import components and actions
import { showToast } from '../notifications/Messages'  
import Errors from '../notifications/Errors'
import signupRequest from './actions'

// Import css
import './index.css'
import logo from '../smartcar.jpg'

const submitBtn = {marginBottom: '10px', width: '50%'}

class Signup extends Component {  
  // Pass the correct proptypes in for validation
  static propTypes = {
    handleSubmit: PropTypes.func,
    signupRequest: PropTypes.func,
    signup: PropTypes.shape({
      requesting: PropTypes.bool,
      successful: PropTypes.bool,
      messages: PropTypes.array,
      errors: PropTypes.array,
    }),
  }

  // Redux Form will call this function with the values of our
  // Form fields "email" and "password" when the form is submitted
  // this will in turn call the action
  submit = values => this.props.signupRequest(values)

  componentWillReceiveProps(nextProps) {
    // reset form errors
    if (!this.props.signup.requesting && this.props.signup.errors == nextProps.signup.errors && !!this.props.signup.errors.length) {
      this.props.signup.errors = []
    }
    // show errors
    if (!!nextProps.signup.errors.length) {
      nextProps.signup.errors.map(e => { 
        showToast('error', e) 
      })
    }
  }

  render () {
    // grab what we need from props.  The handleSubmit from ReduxForm
    // and the pieces of state from the global state.
    const {
      handleSubmit,
      signup: {
        requesting,
        successful,
        messages,
        errors,
      },
    } = this.props

    return (
      <div className='signup-container'>
        <Card elevation={Elevation.FOUR} className='signup-card'>
          <form onSubmit={handleSubmit(this.submit)}>
            <img src={logo} className='smartcar-logo' />
            <FormGroup>
            <Field
              className={`${Classes.INPUT} ${Classes.FILL} ${Classes.LARGE}`} 
              placeholder="Username"
              name="username"
              type="text"
              id="username"
              component="input"
              style={{margin: '10px'}}
            />
            <Field
              className={`${Classes.INPUT} ${Classes.FILL} ${Classes.LARGE}`} 
              placeholder="Password"
              name="password"
              type="password"
              id="password"
              component="input"
              style={{margin: '10px'}}
            />
            </FormGroup>
            <Button icon='new-person' text='Sign Up' className={`${Classes.INTENT_SUCCESS}`} style={submitBtn} type='submit' large={true} />
          </form>
          <div className="auth-messages">
          {!requesting && successful && (
            <Callout intent='success' icon='info-sign'>
              Signup Successful! <Link to="/login">Click here to Login</Link>
            </Callout>
          )}
          {!requesting && !successful && (
            <Link to="/login"><Callout intent='success' icon='info-sign' style={{marginTop: '20px'}}>Already have an account? Login here.</Callout></Link>
          )}
        </div>
        </Card>
      </div>
    )
  }
}

// Grab only the piece of state we need
const mapStateToProps = state => ({  
  signup: state.signup,
})

// Connect our component to redux and attach the "signup" piece
// of state to our "props" in the component.  Also attach the
// "signupRequest" action to our "props" as well.
const connected = connect(mapStateToProps, { signupRequest })(Signup)

// Connect our connected component to Redux Form.  It will namespace
// the form we use in this component as "signup".
const formed = reduxForm({  
  form: 'signup',
  // onChange: (values, dispatch, props) => {
  //   if (props.errors) dispatch(clearSubmitErrors('signup'));
  // },
})(connected)

// Export our well formed component!
export default formed  