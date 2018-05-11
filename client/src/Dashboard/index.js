import React, { Component } from 'react'
import { Navbar, NavbarGroup, NavbarDivider, NavbarHeading, Button, Alignment } from '@blueprintjs/core'
import { logoutRequest } from './actions'
import { connect } from 'react-redux'
import { getUser } from '../lib/auth'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getUser()
    }
  }  
  render () {
    let { user } = this.state
    return (
      <div>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Smartcar Sandbox</NavbarHeading>
            <NavbarDivider />
            <Button className="pt-minimal" icon="home" text="Home" />
            <Button className="pt-minimal" icon="document" text="API" />
            <Button className="pt-minimal" icon="user" text={user.first_name} />
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
            <Button className="pt-minimal" icon="log-out" text="Logout" onClick={this.props.logoutRequest} />
        </NavbarGroup>
      </Navbar>
      </div>
    )
  }
}

// Grab only the piece of state we need
const mapStateToProps = state => ({  
  login: state.login,
})

export default connect(mapStateToProps, { logoutRequest })(Dashboard)