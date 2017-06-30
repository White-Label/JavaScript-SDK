const WhiteLabel = require('../lib/whitelabel.js');
const { CLIENT_ID } = require('../src/secrets.js');
const P = require('bluebird');

var COLLECTION = 'weekly';
var MIXTAPE = 'noon-186';
var TRACK = 'gallant-episode';

let wl;

var notNull = function(obj) {
    expect(obj).not.toBeNull();
    expect(obj).toBeDefined();
};

var verifyObject = function(obj) {
    notNull(obj);
    expect(obj.slug).not.toHaveLength(0);
    expect(obj.id).not.toHaveLength(0);
    expect(obj.title).not.toHaveLength(0);
};

beforeAll(() => {
    wl = new WhiteLabel(CLIENT_ID);
});

describe('White Label JS', function() {
    test('should error with invalid token', function() {
        try {
            var wl = new WhiteLabel();
            fail(
                'Creating a new WhiteLabel object without client id should throw an error'
            );
        } catch (e) {
            expect(e).not.toBeNull();
        }
    });

    test('should not error with valid token', function() {
        var wl = new WhiteLabel(CLIENT_ID);
        notNull(wl);
    });

    describe('White Label APIs', function() {
        beforeEach(function() {
            wl = new WhiteLabel(CLIENT_ID);
        });

        test('should fetch collections', function() {
            return wl.getAllCollections().then(function(collections) {
                notNull(collections);
            });
        });

        test('should fetch all result collections', function() {
            return wl
                .getAllCollections({ results: true, all: true })
                .then(function(collections) {
                    notNull(collections);
                    expect(collections).not.toHaveLength(0);
                    collections.forEach(function(coll) {
                        verifyObject(coll);
                    });
                });
        });

        test('should fetch single collection', function() {
            return wl.getCollection(COLLECTION).then(function(collection) {
                verifyObject(collection);
            });
        });

        test('should fetch all mixtapes', function() {
            return wl.getAllMixtapes().then(function(mixtapes) {
                notNull(mixtapes);
            });
        });

        test('should fetch collection mixtapes', function() {
            return wl
                .getCollectionMixtapes(COLLECTION)
                .then(function(mixtapes) {
                    notNull(mixtapes);
                });
        });

        test('should fetch all collection mixtapes', function() {
            return wl
                .getCollectionMixtapes(COLLECTION, { results: true, all: true })
                .then(function(mixtapes) {
                    expect(mixtapes.length > 20).toBe(true);
                });
        });

        test('should fetch single mixtape', function() {
            return wl.getMixtape(MIXTAPE).then(function(mixtape) {
                verifyObject(mixtape);
            });
        });

        test('should fetch latest mixtape', function() {
            return wl.getLatestMixtape().then(function(mixtape) {
                verifyObject(mixtape);
            });
        });

        test('should fetch all tracks', function() {
            return wl.getAllTracks({ results: true }).then(function(tracks) {
                notNull(tracks);
                expect(tracks).not.toHaveLength(0);
            });
        });

        test('should fetch mixtape tracks', function() {
            return wl
                .getMixtapeTracks(MIXTAPE, { results: true })
                .then(function(tracks) {
                    notNull(tracks);
                    expect(tracks).not.toHaveLength(0);
                });
        });

        test('should fetch single track', function() {
            return wl.getTrack(TRACK).then(function(track) {
                verifyObject(track);
            });
        });

        test('should return an array of tracks', function() {
            return wl.getTrack(TRACK, { all: true }).then(function(track) {
                notNull(track);
                expect(track).toHaveLength(1);
            });
        });

        test('should record play', function() {
            return wl.recordPlay(TRACK);
        });
    });

    describe('White Label Filtering', function() {
        beforeEach(function() {
            wl = new WhiteLabel(CLIENT_ID);
        });

        test('should filter collections by ordering', function() {
            return P.join(
                wl.getAllCollections({
                    results: true,
                    filters: { ordering: '-created' }
                }),
                wl.getAllCollections({
                    results: true,
                    filters: { ordering: 'created' }
                }),
                function(collections1, collections2) {
                    notNull(collections1);
                    notNull(collections2);

                    expect(collections1.length).toBe(collections2.length);
                    expect(collections1[0].slug).not.toBe(collections2[0].slug);
                }
            );
        });

        test('should search for single collection', function() {
            return wl
                .getAllCollections({
                    results: true,
                    filters: { search: 'weekly' }
                })
                .then(function(collections) {
                    notNull(collections);

                    expect(collections).toHaveLength(1);
                    expect(collections[0].slug).toBe('weekly');
                });
        });

        test('should filter mixtapes by collection', function() {
            return P.join(
                wl.getAllMixtapes({ all: true, results: true }),
                wl.getCollectionMixtapes(COLLECTION, {
                    all: true,
                    results: true
                }),
                function(mixtapes1, mixtapes2) {
                    notNull(mixtapes1);
                    notNull(mixtapes2);

                    expect(mixtapes1.length).not.toBe(mixtapes2.length);
                }
            );
        });

        test('should filter mixtapes with method', function() {
            return P.join(
                wl.getAllMixtapes({
                    all: true,
                    results: true,
                    filters: { collection: COLLECTION }
                }),
                wl.getCollectionMixtapes(COLLECTION, {
                    all: true,
                    results: true
                }),
                function(collections1, collections2) {
                    notNull(collections1);
                    notNull(collections2);

                    expect(collections1.length).toBe(collections2.length);
                    expect(collections1[0].slug).toBe(collections2[0].slug);
                    expect(collections1[collections1.length - 1].slug).toBe(
                        collections2[collections2.length - 1].slug
                    );
                }
            );
        });

        test('should search for single mixtape', function() {
            return wl
                .getAllTracks({
                    all: true,
                    results: true,
                    filters: { search: 'Get Mine Ft. Shakka' }
                })
                .then(function(tracks) {
                    notNull(tracks);

                    expect(tracks).toHaveLength(1);
                    expect(tracks[0].title).toBe('Get Mine Ft. Shakka');
                    verifyObject(tracks[0]);
                });
        });

        test('should filter tracks by mixtape', function() {
            return P.join(
                wl.getAllTracks({ all: true, results: true }),
                wl.getMixtapeTracks(MIXTAPE, { all: true, results: true }),
                function(tracks1, tracks2) {
                    notNull(tracks1);
                    notNull(tracks2);

                    expect(tracks1.length).not.toBe(tracks2.length);
                }
            );
        });

        test('should filter tracks by ordering', function() {
            return P.join(
                wl.getMixtapeTracks(MIXTAPE, {
                    all: true,
                    results: true,
                    filters: { ordering: 'artist' }
                }),
                wl.getMixtapeTracks(MIXTAPE, { all: true, results: true }),
                function(tracks1, tracks2) {
                    notNull(tracks1);
                    notNull(tracks2);

                    expect(tracks1.length).toBe(tracks2.length);
                    expect(tracks1[0].slug).not.toBe(tracks2[0].slug);
                }
            );
        });
    });
});
