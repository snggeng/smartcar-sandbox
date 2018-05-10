import React, { Component } from 'react'  
import PropTypes from 'prop-types'
import { reduxForm, Field, clearSubmitErrors } from 'redux-form'  
import { connect } from 'react-redux'  
import { Link } from 'react-router-dom'
import { Button, Card, Elevation, Classes, Colors, Callout, FormGroup } from "@blueprintjs/core"

// Import components and actions
import { showToast } from '../notifications/Messages'  
import Errors from '../notifications/Errors'
import loginRequest from './actions'

// Import css
import './index.css'
import logo from '../smartcar.jpg'

const submitBtn = {marginBottom: '10px', width: '50%'}

// If you were testing, you'd want to export this component
// so that you can test your custom made component and not
// test whether or not Redux and Redux Form are doing their jobs
class Login extends Component {  
  // Pass the correct proptypes in for validation
  static propTypes = {
    handleSubmit: PropTypes.func,
    loginRequest: PropTypes.func,
    login: PropTypes.shape({
      requesting: PropTypes.bool,
      successful: PropTypes.bool,
      messages: PropTypes.array,
      errors: PropTypes.array,
    }),
  }

  componentWillReceiveProps(nextProps) {
    // show successful login
    if (nextProps.login.successful) {
      nextProps.login.messages.map(e => { 
        showToast('success', e) 
      })
    }
    // reset form errors
    if (!this.props.login.requesting && this.props.login.errors == nextProps.login.errors && !!this.props.login.errors.length) {
      this.props.login.errors = []
    }
    // show errors
    if (!!nextProps.login.errors.length) {
      nextProps.login.errors.map(e => { 
        showToast('error', e) 
      })
    }
  }

  // Remember, Redux Form passes the form values to our handler
  // In this case it will be an object with `email` and `password`
  submit = (values) => {
    this.props.loginRequest(values)
  }

  render () {
    const {
      handleSubmit, // remember, Redux Form injects this into our props
      login: {
        requesting,
        successful,
        messages,
        errors,
      },
    } = this.props

    return (
      <div className='login-container'>
        <Card elevation={Elevation.FOUR} className='login-card'>
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
            <Button icon='log-in' text='Login' className={`${Classes.INTENT_SUCCESS}`} style={submitBtn} type='submit' large={true} />
          </form>
          <div className="auth-messages">
          {!requesting && !successful && (
            <Link to="/signup"><Callout intent='success' icon='info-sign' style={{marginTop: '20px'}}>Need to Signup? Click Here</Callout></Link>
          )}
        </div>
        </Card>
      </div>
    )
  }
}

// Grab only the piece of state we need
const mapStateToProps = state => ({  
  login: state.login,
})

// make Redux state piece of `login` and our action `loginRequest`
// available in this.props within our component
const connected = connect(mapStateToProps, { loginRequest })(Login)

// in our Redux's state, this form will be available in 'form.login'
const formed = reduxForm({  
  form: 'login',
  onChange: (values, dispatch, props) => {
    if (props.error) dispatch(clearSubmitErrors('login'));
  }
})(connected)

// Export our well formed login component
export default formed  