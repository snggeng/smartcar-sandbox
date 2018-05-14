const smartcar = require('smartcar')
const { mapAsync } = require('../utils')

// Add mapAsync to Array prototype
Array.prototype.mapAsync = mapAsync

// Initialize authClient
// TODO: allow user to configure scope
const client = new smartcar.AuthClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/dashboard',
    // scope: ['read_vehicle_info', 'read_vin', 'read_location', 'control_security', 
    //         'control_security:unlock', 'read_odometer', 'control_security:lock'],
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
    return smartcar.getVehicleIds(req.params.id, {offset: 0, limit: 20})
        .then(function(response) {
        res.json(response);
    });
} 

const getVehicles = (req, res, next) => {
    // set options with default set to offset: 0, limit: 20
    let options = {}
    options.offset = req.query.offset || 0
    options.limit = req.query.limit || 20
    // get vehicle
    return smartcar.getVehicleIds(req.params.token, options)
        .then(async (response) => {
            let vehicles = await response.vehicles.mapAsync(async (v, i) => {
                // handle async calls to get vehicle data
                let vehicle = await new smartcar.Vehicle(response.vehicles[i], req.params.token)
                let info = await vehicle.info()
                let location = await vehicle.location()
                let odometer = await vehicle.odometer()
                let vin = await vehicle.vin()
                let vehicleInfo = { info, location, odometer, vin }
                return vehicleInfo
                // Insufficient permission for all of the above
                // return info
            })
            res.json(vehicles);
        });
} 

const lockVehicle = (req, res, next) => {
    let vehicle = new smartcar.Vehicle(req.params.id, req.params.token)
    vehicle.lock().then((response) => res.json(response))
}

const unlockVehicle = (req, res, next) => {
    let vehicle = new smartcar.Vehicle(req.params.id, req.params.token)
    vehicle.unlock().then((response) => res.json(response))
}



module.exports = { authFlow, callback, getAccess, getVehicleIds, getVehicles, lockVehicle, unlockVehicle }