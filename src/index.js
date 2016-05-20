import axios from 'axios';

class WhiteLabelAPI {
    constructor(clientId) {
        // Define API endpoints
        this.BASE_URL = 'http://beta.whitelabel.cool/api';
        this.COLLECTIONS = '/collections/';
        this.MIXTAPES = '/mixtapes/';
        this.TRACKS = '/tracks/';
        this.RECORD = '/events/plays/';

        this.request = axios.create({
            baseURL: this.BASE_URL,
            timeout: 2000,
            headers: {
                'Accept': 'application/json; version=1.0',
                'Client': clientId,
            },
        });
    }

    normalizePath(path) {
        return path.split('//').join('/');
    }

    // ES7 async and await 🔥
    async getFetch(path, options = {
        page: 1,
        all: false,
        results: false,
    }) {
        let results = [];
        const config = {
            params: {
                page: options.page,
            },
        };

        // Throws an error the request was unsuccessful
        // The error can be caught in the .catch of a Promise
        const checkSuccess = function(response) {
            if (response.status !== 200) {
                throw new Error('Status code was ' + response.status);
            }
        };

        let response = await this.request.get(this.normalizePath(path + '/'), config);
        checkSuccess(response);

        response = response.data;
        results.push(response);

        if (options.all && response.next) {
            delete config.params.path;
            while (response && response.next) {
                response = await this.request.get(response.next, config);
                checkSuccess(response);

                response = response.data;
                results.push(response);
            }
        }

        let returnResults = !options.all ? results[0] : results;

        // if options.results is true, we will return a flat array of all
        // results arrays from white label api.
        // This is useful if you set options.all and (for example) fetch all
        // of a collection mixtapes.
        if (options.results) {
            if (options.all) {
                let flattened = false;
                const mappedResults = returnResults.map(function(obj) {
                    flattened = (obj.results !== undefined && obj.results !== null);
                    return obj.results ? obj.results : obj;
                });
                returnResults = flattened ? [].concat(...mappedResults) : mappedResults;
            } else {
                returnResults = returnResults.results ? returnResults.results : returnResults;
            }
        }
        return returnResults;
    }

    getAllCollections(options) {
        return this.getFetch(this.COLLECTIONS, options);
    }

    getCollection(collection, options) {
        return this.getFetch(this.COLLECTIONS + collection, options);
    }

    getCollectionMixtapes(collection, options) {
        return this.getFetch(this.COLLECTIONS + collection + this.MIXTAPES, options);
    }

    getMixtape(mixtape, options) {
        return this.getFetch(this.MIXTAPES + mixtape, options);
    }

    getMixtapeTracks(mixtape, options) {
        return this.getFetch(this.MIXTAPES + mixtape + this.TRACKS, options);
    }

    getTrack(track, options) {
        return this.getFetch(this.TRACKS + track, options);
    }

    recordPlay(track) {

    }
}

export default WhiteLabelAPI;
