import axios from 'axios';
import merge from 'merge';

class WhiteLabelAPI {
    constructor(clientId) {
        // Define API endpoints
        this.BASE_URL = 'https://beta.whitelabel.cool/api';
        this.COLLECTIONS = '/collections/';
        this.MIXTAPES = '/mixtapes/';
        this.LATEST_MIXTAPE = '/mixtapes/latest/';
        this.TRACKS = '/tracks/';
        this.RECORD = '/events/plays/';
        this.CLIENT_ID = clientId;

        if (!clientId || clientId === '') {
            throw new Error('You must provide a valid client id');
        }

        this.request = axios.create({
            baseURL: this.BASE_URL,
            timeout: 10000,
            headers: {
                Accept: 'application/json; version=1.0',
                Client: clientId
            }
        });
    }

    // Fix any double /'s that may occur when joining paths
    normalizePath(path) {
        return path.split('//').join('/');
    }

    // ES7 async and await 🔥
    async getFetch(
        path,
        options = {
            page: 1,
            all: false,
            results: false,
            filters: {}
        }
    ) {
        if (!options.filters) options.filters = {};

        let results = [];
        const config = {
            params: merge({ page: options.page }, options.filters)
        };

        // Throws an error if the request was unsuccessful
        // The error can be caught in the .catch of a Promise
        const checkSuccess = function(response) {
            if (response.status !== 200) {
                throw new Error('Status code was ' + response.status);
            }
        };

        let response = await this.request.get(
            this.normalizePath(path + '/'),
            config
        );
        checkSuccess(response);

        response = response.data;
        results.push(response);

        // Follow the next field of response until null
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
                    flattened =
                        obj.results !== undefined && obj.results !== null;
                    return obj.results ? obj.results : obj;
                });
                returnResults = flattened
                    ? [].concat(...mappedResults)
                    : mappedResults;
            } else {
                returnResults = returnResults.results
                    ? returnResults.results
                    : returnResults;
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

    getAllMixtapes(options) {
        return this.getFetch(this.MIXTAPES, options);
    }

    getCollectionMixtapes(collection, options) {
        options = merge.recursive(options, {
            filters: {
                collection: collection
            }
        });
        return this.getFetch(this.MIXTAPES, options);
    }

    getMixtape(mixtape, options) {
        return this.getFetch(this.MIXTAPES + mixtape, options);
    }

    getLatestMixtape() {
        return this.getFetch(this.LATEST_MIXTAPE);
    }

    getAllTracks(options) {
        return this.getFetch(this.TRACKS, options);
    }

    getMixtapeTracks(mixtape, options) {
        options = merge.recursive(options, {
            filters: {
                mixtape: mixtape
            }
        });
        return this.getFetch(this.TRACKS, options);
    }

    getTrack(track, options) {
        return this.getFetch(this.TRACKS + track, options);
    }

    recordPlay(track) {
        return this.request.post(this.RECORD + track + '/');
    }
}

export default WhiteLabelAPI;
