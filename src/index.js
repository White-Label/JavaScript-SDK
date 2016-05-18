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

    makeRequest(path, params = {}, method = 'GET') {
        if (!path.endsWith('/')) {
            path += '/';
        }
        path = path.split('//').join('/');
        return new Promise((resolve, reject) => {
            this.request.get(path, params).then(function(response) {
                if (response.status === 200) {
                    resolve(response.data);
                } else {
                    reject('Status code: ' + response.status);
                }
            }).catch(function(error) {
                reject(error);
            });
        });
    }

    getAllCollections(page = 1) {
        return this.makeRequest(this.COLLECTIONS, {
            page,
        });
    }

    getCollection(collection, page = 1) {
        return this.makeRequest(this.COLLECTIONS + collection, {
            page,
        });
    }

    getCollectionMixtapes(collection, page = 1) {
        return this.makeRequest(this.COLLECTIONS + collection + this.MIXTAPES, {
            page,
        });
    }

    getMixtape(mixtape, page = 1) {
        return this.makeRequest(this.MIXTAPES + mixtape, {
            page,
        });
    }

    getMixtapeTracks(mixtape, page = 1) {
        return this.makeRequest(this.MIXTAPES + mixtape + this.TRACKS, {
            page,
        });
    }

    getTrack(track) {
        return this.makeRequest(this.TRACKS + track);
    }

    recordPlay(track) {

    }
}

export default WhiteLabelAPI;
