var expect = chai.expect;

var COLLECTION = 'weekly';
var MIXTAPE = 'noon-186';
var TRACK = 'gallant-episode';

var notNull = function(obj) {
    expect(obj).to.not.be.null;
    expect(obj).to.not.be.undefined;
};

var randomArrIndex = function(arr) {
    return Math.floor(Math.random() * (arr.length - 0 + 1));
};

describe('White Label JS', function() {
    this.timeout(40000);
    it('should error with invalid token', function() {
        try {
            var wl = new WhiteLabel();
            fail('Creating a new WhiteLabel object without client id should throw an error');
        } catch (e) {
            expect(e).to.not.be.null;
        }
    });

    it('should not error with valid token', function() {
        var wl = new WhiteLabel(CLIENT_ID);
        notNull(wl);
    });

    describe('White Label APIs', function() {
        beforeEach(function() {
            this.wl = new WhiteLabel(CLIENT_ID);
        });

        it('should fetch collections', function() {
            return this.wl.getAllCollections().then(function(collections) {
                notNull(collections);
            });
        });

        it('should fetch all result collections', function() {
            return this.wl.getAllCollections({results: true, all: true}).then(function(collections) {
                notNull(collections);
                expect(collections).to.not.be.length(0);
                collections.forEach(function(coll) {
                    expect(coll.title).to.not.be.empty;
                    expect(coll.id).to.not.be.empty;
                    expect(coll.slug).to.not.be.empty;
                });
            });
        });

        it('should fetch single collection', function() {
            return this.wl.getCollection(COLLECTION).then(function(collection) {
                notNull(collection);
                expect(collection.id).to.not.be.empty;
                expect(collection.slug).to.not.be.empty;
            });
        });

        it('should fetch all mixtapes', function() {
            return this.wl.getAllMixtapes().then(function(mixtapes) {
                notNull(mixtapes);
            });
        });

        it('should fetch collection mixtapes', function() {
            return this.wl.getCollectionMixtapes(COLLECTION).then(function(mixtapes) {
                notNull(mixtapes);
            });
        });

        it('should fetch all collection mixtapes', function() {
            return this.wl.getCollectionMixtapes(COLLECTION, {results: true, all: true}).then(function(mixtapes) {
                expect(mixtapes.length > 20).to.be.true;
            });
        });

        it('should fetch single mixtape', function() {
            return this.wl.getMixtape(MIXTAPE).then(function(mixtape) {
                notNull(mixtape);
                expect(mixtape.slug).to.not.be.empty;
                expect(mixtape.id).to.not.be.empty;
                expect(mixtape.title).to.not.be.empty;
            });
        });

        it('should fetch all tracks', function() {
            return this.wl.getAllTracks({results: true}).then(function(tracks) {
                notNull(tracks);
                expect(tracks).to.not.be.length(0);
            });
        });

        it('should fetch mixtape tracks', function() {
            return this.wl.getMixtapeTracks(MIXTAPE, {results: true}).then(function(tracks) {
                notNull(tracks);
                expect(tracks).to.not.be.length(0);
            });
        });

        it('should fetch single track', function() {
            return this.wl.getTrack(TRACK).then(function(track) {
                notNull(track);
                expect(track.id).to.not.be.empty;
                expect(track.slug).to.not.be.empty;
                expect(track.stream_url).to.not.be.empty;
            });
        });

        it('should return an array of tracks', function() {
            return this.wl.getTrack(TRACK, {all: true}).then(function(track) {
                notNull(track);
                expect(track).to.be.length(1);
            });
        });

        it('should record play', function() {
            return this.wl.recordPlay(TRACK);
        });
    });

    describe('White Label Filtering', function() {
        beforeEach(function() {
            this.wl = new WhiteLabel(CLIENT_ID);
        });

        it('should filter collections by ordering', function() {
            return P.join(
                this.wl.getAllCollections({results: true, filters: {ordering: '-created'}}),
                this.wl.getAllCollections({results: true, filters: {ordering: 'created'}}),
                function(collections1, collections2) {
                    notNull(collections1);
                    notNull(collections2);

                    expect(collections1.length).to.be.equal(collections2.length);
                    expect(collections1[0].slug).to.not.be.equal(collections2[0].slug);
                }
            );
        });

        it('should search for single collection', function() {
            return this.wl.getAllCollections({results: true, filters: {search: 'weekly'}}).then(function(collections) {
                notNull(collections);

                expect(collections).to.be.length(1);
                expect(collections[0].slug).to.be.equal('weekly');
            });
        });

        it('should filter mixtapes by collection', function() {
            return P.join(
                this.wl.getAllMixtapes({all: true, results: true}),
                this.wl.getCollectionMixtapes(COLLECTION, {all: true, results: true}),
                function(mixtapes1, mixtapes2) {
                    notNull(mixtapes1);
                    notNull(mixtapes2);

                    expect(mixtapes1.length).to.not.be.equal(mixtapes2.length);
                }
            );
        });

        it('should search for single mixtape', function() {
            return this.wl.getAllTracks({all: true, results: true, filters: {search: 'Get Mine Ft. Shakka'}}).then(function(tracks){
                notNull(tracks);

                expect(tracks).to.be.length(1);
                expect(tracks[0].title).to.be.equal('Get Mine Ft. Shakka');
            });
        });

        it('should filter tracks by mixtape', function() {
            return P.join(
                this.wl.getAllTracks({all: true, results: true}),
                this.wl.getMixtapeTracks(MIXTAPE, {all: true, results: true}),
                function(tracks1, tracks2) {
                    notNull(tracks1);
                    notNull(tracks2);

                    expect(tracks1.length).to.not.be.equal(tracks2.length);
                }
            );
        });

        it('should filter tracks by ordering', function() {
            return P.join(
                this.wl.getMixtapeTracks(MIXTAPE, {all: true, results: true, filters: {ordering: 'artist'}}),
                this.wl.getMixtapeTracks(MIXTAPE, {all: true, results: true}),
                function(tracks1, tracks2) {
                    notNull(tracks1);
                    notNull(tracks2);

                    expect(tracks1.length).to.be.equal(tracks2.length);
                    expect(tracks1[0].slug).to.not.be.equal(tracks2[0].slug);
                }
            );
        });
    });
});
