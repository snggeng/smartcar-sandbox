import React, { Component } from 'react'
import { Navbar, NavbarGroup, NavbarDivider, NavbarHeading, Button, Alignment } from '@blueprintjs/core'
import { logoutRequest } from './actions'
import { connect } from 'react-redux'

class Dashboard extends Component {  
  render () {
    return (
      <div>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Smartcar Sandbox</NavbarHeading>
            <NavbarDivider />
            <Button className="pt-minimal" icon="home" text="Home" />
            <Button className="pt-minimal" icon="document" text="Files" />
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