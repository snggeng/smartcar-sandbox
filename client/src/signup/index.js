import React, { Component } from 'react'  
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'  
import { connect } from 'react-redux'  
import { Link } from 'react-router-dom'
import { Icon, Button, Card, Elevation, Classes, Callout, FormGroup } from "@blueprintjs/core"

// Import components and actions
import { showToast } from '../Notifications'  
import signupRequest from './actions'

// Import css
import './index.css'
import logo from '../smartcar.jpg'

const submitBtn = {marginBottom: '10px', width: '50%'}

// Redux Form Validation Rules
const required = value => (value ? undefined : 'Required')
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength15 = maxLength(15)
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
const minLength2 = minLength(2)
// const email = value =>
//   value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
//     ? 'Invalid email address'
//     : undefined

// Custom Form Input Field    
const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div>
    <FormGroup className={error && touched ? Classes.INTENT_DANGER : null}>
      <input {...input} 
        placeholder={label} 
        type={type} 
        className={`${Classes.INPUT} ${Classes.FILL} ${Classes.LARGE}`}
         />
      {touched &&
        ((error && <div className={Classes.FORM_HELPER_TEXT}><Icon icon='error' iconSize={15} /> {error}</div>) ||
          (warning && <div className={Classes.FORM_HELPER_TEXT}><Icon icon='warning-sign' iconSize={15} /> {warning}</div>))}
    </FormGroup>
  </div>
)

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
    if (!this.props.signup.requesting && this.props.signup.errors === nextProps.signup.errors && !!this.props.signup.errors.length) {
      this.props.signup.errors = []
    }
    // show errors
    if (!!nextProps.signup.errors.length) {
      nextProps.signup.errors.map(e => showToast('error', e))
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
      },
    } = this.props

    return (
      <div className='signup-container'>
        <Card elevation={Elevation.FOUR} className='signup-card'>
          <form onSubmit={handleSubmit(this.submit)}>
            <img src={logo} className='smartcar-logo' />
            <FormGroup>
            <Field
              label="Username"
              name="username"
              type="text"
              id="username"
              component={renderField}
              validate={[required, maxLength15, minLength2]}
            />
            <Field
              className={`${Classes.INPUT} ${Classes.FILL} ${Classes.LARGE}`} 
              label="Password"
              name="password"
              type="password"
              id="password"
              component={renderField}
              validate={[required, minLength2]}
              style={{margin: '10px'}}
            />
            <Field
              className={`${Classes.INPUT} ${Classes.FILL} ${Classes.LARGE}`} 
              label="First Name"
              name="first_name"
              type="text"
              id="first_name"
              component={renderField}
              validate={[required, minLength2]}
              style={{margin: '10px'}}
            />
            <Field
              className={`${Classes.INPUT} ${Classes.FILL} ${Classes.LARGE}`} 
              label="Last Name"
              name="last_name"
              type="text"
              id="last_name"
              component={renderField}
              validate={[required, minLength2]}
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