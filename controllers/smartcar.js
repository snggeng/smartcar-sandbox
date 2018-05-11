const smartcar = require('smartcar');

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
    console.log('link', link)
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
            // instantiate first vehicle in vehicle list
            const vehicle = new smartcar.Vehicle(res.vehicles[0], access.accessToken);
            // get identifying information about a vehicle
            return vehicle.info();
        })
        .then((data) => {
            console.log(data);
            data.access = access
            // json response will be sent to the user
            res.json(data)
        })
}

module.exports = { authFlow, callback }