import React, { Component } from 'react'
import { TAG } from '@blueprintjs/icons/lib/esm/generated/iconContents';
import { Navbar, NavbarGroup, NavbarDivider, NavbarHeading, Button, Alignment, Card, Elevation, Icon, Tag, Intent } from '@blueprintjs/core'
import { logoutRequest, smartcarAuthRequest, smartcarAuthSuccess, lockRequest, unlockRequest } from './actions'
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

  handleLock = async (e) => {
    console.log(e.target.id)
    this.props.lockRequest(e.target.id.substring(0, e.target.id.length-4))
  }

  handleUnlock = async (e) => {
    this.props.unlockRequest(e.target.id.substring(0, e.target.id.length-6))
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
              <Button className="pt-minimal" icon="cog" text='Settings' />
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
              <Button className="pt-minimal" icon="log-out" text="Logout" onClick={this.props.logoutRequest} />
          </NavbarGroup>
        </Navbar>
        <div className='dashboard-container'>
          <Card elevation={Elevation.FOUR} className='dashboard-card'>
          <h5><Icon icon='user' size={30}/> {user.first_name} {user.last_name}</h5>
          <p>{this.props.user.smartcar ? 'Connected to Smartcar API with valid access token.' : 'Yet to connect to Smartcar API. No access token.'}</p>
          {this.props.dashboard.type === 'SMARTCAR_RESPONSE_SUCCESS' && this.props.dashboard.messages[0].body instanceof Array ? this.props.dashboard.messages[0].body.map(m => 
            (
              <Card key={m.info.id} className='vehicle-card'>
                <h3>{m.info.make}</h3>
                <Tag intent={Intent.PRIMARY} interactive={true} minimal={true} className='vehicle-tag'>{m.info.year}</Tag>
                <Tag intent={Intent.SUCCESS} interactive={true} minimal={true} className='vehicle-tag'>{m.info.model}</Tag>
                <Tag intent={Intent.PRIMARY} interactive={true} minimal={true} className='vehicle-tag'>VIN: {m.vin}</Tag>
                {/* <Tag intent={Intent.SUCCESS} interactive={true} minimal={true} className='vehicle-tag'>isLocked: {m.isLocked}</Tag> */}
                <Tag intent={Intent.SUCCESS} interactive={true} minimal={true} className='vehicle-tag'>Odometer: {m.odometer.data.distance}</Tag>
                <Tag intent={Intent.PRIMARY} interactive={true} minimal={true} className='vehicle-tag'>Location: lat {m.location.data.latitude}, long {m.location.data.longitude}</Tag>
                <Button text='Lock' id={m.info.id + 'lock'} onClick={this.handleLock}/>
                <Button text='Unlock' id={m.info.id + 'unlock'} onClick={this.handleUnlock}/>
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

export default connect(mapStateToProps, { logoutRequest, smartcarAuthRequest, smartcarAuthSuccess, updateUser, lockRequest, unlockRequest })(Dashboard)