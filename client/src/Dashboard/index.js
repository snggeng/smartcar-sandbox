import React, { Component } from 'react'
import { Navbar, NavbarGroup, NavbarDivider, NavbarHeading, Button, Alignment, Card, Elevation, Icon } from '@blueprintjs/core'
import { logoutRequest, smartcarAuthRequest, smartcarAuthSuccess } from './actions'
import { connect } from 'react-redux'
import { getUser } from '../lib/auth'

// Import css
import './index.css'
import logo from '../smartcar.jpg' 

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      dashboard: {}
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
              <img src={logo} alt='smartcar-logo' className='dashboard-smartcar-logo'/>
              <NavbarHeading> Smartcar Sandbox</NavbarHeading>
              <NavbarDivider />
              {/* <Button className="pt-minimal" icon="home" text="Home" /> */}
              <a target="_blank" href="https://smartcar.com/docs">
                <Button className="pt-minimal" icon="document" text="API" />
              </a>
              <Button className="pt-minimal" icon="cog" text='settings' />
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
              <Button className="pt-minimal" icon="log-out" text="Logout" onClick={this.props.logoutRequest} />
          </NavbarGroup>
        </Navbar>
        <div className='dashboard-container'>
          <Card elevation={Elevation.FOUR} className='dashboard-card'>
          <h5><Icon icon='user' size={30}/> {user.first_name} {user.last_name}</h5>
          <p>{this.props.user.smartcar ? 'Connected to Smartcar API with valid access token.' : 'Yet to connect to Smartcar API. No access token.'}</p>
          <p>{this.props.dashboard ? JSON.stringify(this.props.dashboard.messages[0].body) : null }</p>
            <Button text="Connect to your car" onClick={this.props.smartcarAuthRequest} />
          </Card>
        </div>
      </div>
    )
  }
}

// Grab only the piece of state we need
const mapStateToProps = state => ({  
  user: state.user,
  dashboard: state.dashbaord
})

export default connect(mapStateToProps, { logoutRequest, smartcarAuthRequest, smartcarAuthSuccess })(Dashboard)