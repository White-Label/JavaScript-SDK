var wl = new WhiteLabel(CLIENT_ID);

var promiseTest = function(name, promise) {
    var message = '\n' + name;
    promise.then(function(results) {
        console.log(message);
        console.log(results);
    }).catch(function(error) {
        console.log(message + ' --- ERROR ---');
        console.log(error);
    });
};

var COLLECTION = 'weekly';
var MIXTAPE = 'noon-186';
var TRACK = 'gallant-episode';

promiseTest('All Collections', wl.getAllCollections({
    results: true,
    filters: {
        search: 'weekly'
    }
}));

promiseTest('Single Collection', wl.getCollection(COLLECTION));
promiseTest('All Mixtapes', wl.getAllMixtapes({all: true, results: true}));
promiseTest('Collection Mixtapes', wl.getCollectionMixtapes(COLLECTION, {all: true, results: true}));
promiseTest('Collection Mixtapes', wl.getCollectionMixtapes(COLLECTION, {filters: {ordering: 'title'}}));
promiseTest('Single Mixtape', wl.getMixtape(MIXTAPE));
promiseTest('Latest Mixtape', wl.getLatestMixtape());
promiseTest('All Tracks', wl.getAllTracks({all: true, results: true}));
promiseTest('Mixtape Tracks', wl.getMixtapeTracks(MIXTAPE));
promiseTest('Single Track', wl.getTrack(TRACK, {}));
promiseTest('Record Play', wl.recordPlay(TRACK));

// Get all Mixtapes + Tracks in json format
// console.log('All Mixtapes with Tracks');
// var mixtapeTracks = [];

// var completedMT = function() {
//     mixtapeTracks.sort(function(a, b) {
//         return (new Date(a.created)) - (new Date(b.created));
//     });
//     debugger;
//     var s = JSON.stringify(mixtapeTracks);
//     console.log(s);
// };

// wl.getCollectionMixtapes(COLLECTION, {all: true, results: true}).then(function(mixtapes) {
//     mixtapes.map(function(mix, index) {
//         wl.getMixtapeTracks(mix.slug, {all: true, results: true}).then(function(tracks) {
//             mix.tracks = tracks;
//             mixtapeTracks.push(mix);
//             console.log('\ngot tracks for ' + index);
//             console.log(mix);
//             if (index >= mixtapes.length - 1) completedMT();
//         });
//     });
// });
