var axios = require('axios');
// import axios from './axios/lib/axios.js';

class Test {
    constructor() {}
    go() {
        return axios.get('http://www.google.com');
    }
}

export default Test;
