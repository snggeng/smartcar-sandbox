import React from 'react'
import  { Link } from 'react-router-dom'
import './index.css'

const NoMatch = () => (
    <div>
        <div id="clouds">
            <div class="cloud x1"></div>
            <div class="cloud x1_5"></div>
            <div class="cloud x2"></div>
            <div class="cloud x3"></div>
            <div class="cloud x4"></div>
            <div class="cloud x5"></div>
        </div>
        <div class='c'>
            <div class='_404'>404</div>
            <hr/>
            <div class='_1'>THE PAGE</div>
            <div class='_2'>WAS NOT FOUND</div>
            <Link to='/'><a class='btn' href='#'>BACK TO HOME</a></Link>
        </div>
    </div>
)

export default NoMatch