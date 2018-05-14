import React, { Component } from 'react'
import { TAG } from '@blueprintjs/icons/lib/esm/generated/iconContents';
import { Navbar, NavbarGroup, NavbarDivider, NavbarHeading, Button, Alignment, Card, Elevation, Icon, Tag, Intent } from '@blueprintjs/core'
import { logoutRequest, smartcarAuthRequest, smartcarAuthSuccess } from './actions'
import { connect } from 'react-redux'
import { getUser } from '../lib/auth'
import { updateUser } from '../User/actions'

// Import css
import './index.css'
import logo from '../smartcar.jpg' 

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      dashboard: undefined
    }
  }
  
  componentWillMount() {
    // dispatch action on redirect
    if (this.props.location.search.includes('code')) {
      // update store
      this.props.smartcarAuthSuccess(this.props.location.search)
    }
    // check if access_token exists
    if (!!this.props.user.access_token) {
      this.props.updateUser()
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
          {this.props.user.smartcar && this.props.dashboard.type === 'SMARTCAR_RESPONSE_SUCCESS' ? this.props.dashboard.messages[0].body.map(m => 
            (
              <Card key={m.id} className='vehicle-card'>
                <h3>{m.make}</h3>
                <Tag intent={Intent.PRIMARY} interactive={true} minimal={true} className='vehicle-tag'>{m.year}</Tag>
                <Tag intent={Intent.SUCCESS} interactive={true} minimal={true} className='vehicle-tag'>{m.model}</Tag>
                <p></p>
                <p></p>
              </Card>
            )
          ) : null }
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
  dashboard: state.dashboard
})

export default connect(mapStateToProps, { logoutRequest, smartcarAuthRequest, smartcarAuthSuccess, updateUser })(Dashboard)