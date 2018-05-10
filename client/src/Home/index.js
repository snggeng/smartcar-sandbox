import React from 'react'
import { Button, ButtonGroup, Card, Elevation, Classes, Colors } from "@blueprintjs/core"
import { Link } from 'react-router-dom'

// Import css
import './index.css'
import logo from '../smartcar.jpg'

const green = {color: Colors.GREEN4}

const Home = props => (
    <div className='home-container'>
        <Card elevation={Elevation.FOUR} className='home-card'>
            <h1>Smartcar Sandbox</h1>
            <img src={logo} className='smartcar-logo' />
            <p className='home-subtitle'>Welcome to the Smartcar Sandbox.</p>
            <p className='home-content'>You can use this application to demo the Smartcar API. 
               The source code for this application can be found <a href='https://github.com/snggeng/smartcar-sandbox' style={green}>here</a>.
               Please refer to the <a href='https://smartcar.com/docs' style={green} >Smartcar API</a> for more information on how to connect to it.</p>
                <ButtonGroup large={true} minimal={true}>
                    <Link to='/login'>
                        <Button icon='log-in' text='Login' className={Classes.INTENT_SUCCESS} style={green}/>
                    </Link>
                    <Link to='/signup'>
                        <Button icon='new-person' text='Sign Up' className={Classes.INTENT_SUCCESS} style={green}/>
                    </Link>
                </ButtonGroup>
        </Card>
    </div>
)

export default Home