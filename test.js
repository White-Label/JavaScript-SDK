var NoonAPI = require('./lib/noonapi.min.js');
// var axios = require('axios');
var popsicle = require('popsicle');

var CLIENT_ID = 'TSaAKdrGCkWF8erxzjc7k7wJmj0UmYPOAx2MLdPX';

// var noon = new NoonAPI(CLIENT_ID);
var noon = new NoonAPI();

noon.go().then(function(results) {
    console.log(results);
}).catch(function(err) {
    console.log(err);
});
// popsicle.get('http://www.google.com').then(function(result) {
//     console.log(result);
// });

// var request = axios.create({
//     baseURL: 'http://beta.whitelabel.cool/api',
//     timeout: 2000,
//     headers: {
//         'Accept': 'application/json; version=1.0',
//         'Client': CLIENT_ID,
//     },
// });

// request.get('/collections').then(function(result) {
//     console.log(result);
// });
