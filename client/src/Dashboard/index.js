import React, { Component } from 'react'
import { Navbar, NavbarGroup, NavbarDivider, NavbarHeading, Button, Alignment } from '@blueprintjs/core'
import { logoutRequest, smartcarAuthRequest, smartcarAuthSuccess } from './actions'
import { connect } from 'react-redux'
import { getUser } from '../lib/auth'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {}
    }
  }
  
  componentWillMount() {
    if (this.props.location.search.includes('code')) {
      // update store
      this.props.smartcarAuthSuccess(this.props.location.search)
    }

    this.setState({user: getUser()})
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
      <Button onClick={this.props.smartcarAuthRequest} />
      </div>
    )
  }
}

// Grab only the piece of state we need
const mapStateToProps = state => ({  
  login: state.login,
  dashboard: state.dashbaord
})

export default connect(mapStateToProps, { logoutRequest, smartcarAuthRequest, smartcarAuthSuccess })(Dashboard)