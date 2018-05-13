const smartcar = require('smartcar')
const { mapAsync } = require('../utils')

// Add mapAsync to Array prototype
Array.prototype.mapAsync = mapAsync

const client = new smartcar.AuthClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/dashboard',
    scope: ['read_vehicle_info'],
    development: true, // include "mock" Smartcar brand in make selector for testing
  });
  
// Redirect to Smartcar's authentication flow
  //get
const authFlow = (req, res) => {
    const link = client.getAuthUrl({state: req.user._id});
    // console.log('link', link)
    // send redirect link back
    res.json(link);
};
  
// Handle Smartcar callback with auth code
const callback = (req, res, next) => {
    let access
    // the user denied your requested permissions
    if (req.query.error) return next(new Error(req.query.error))
    // exchange auth code for access token
    return client.exchangeCode(req.query.code)
        .then((_access) => {
            // in a production app you'll want to store this in some kind of persistent storage
            access = _access;
            // get the user's vehicles
            return smartcar.getVehicleIds(access.accessToken);
        })
        .then((res) => {
            // instantiate vehicles in vehicle list
            let vehicles = res.vehicles.mapAsync((v, i) => new smartcar.Vehicle(res.vehicles[i], access.accessToken).info())
            // get identifying information about a vehicle
            return vehicles
        })
        .then((data) => {
            // send access token back to user
            let response = {}
            response.vehicles = data
            response.access = access
            // json response will be sent to the user
            res.json(response)
        })
}

const getAccess = (req, res, next) => {
    let access
    // the user denied your requested permissions
    if (req.query.error) return next(new Error(req.query.error))
    // exchange auth code for access token
    return client.exchangeCode(req.query.code)
        .then(_access => res.json(_access))
}

// Get list of vehicles authorized by the user
const getVehicleIds = (req, res, next) => {
    return smartcar.getVehicleIds('cf7ba7e9-8c5d-417d-a99f-c386cfc235cc', {offset: 0, limit: 20})
        .then(function(response) {
        res.json(response);
    });
} 

// const lockVehicle = (req, res, next) => {

// }

module.exports = { authFlow, callback, getAccess, getVehicleIds, }