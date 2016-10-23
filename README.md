# whitelabel.js

[![npm version](https://badge.fury.io/js/white-label-js.svg)](https://badge.fury.io/js/white-label-js)

Create a music platform on the web with whitelabel.js

## Usage

This library is available as an npm package or UMD module.

### UMD module for Browser

Include this script tag somewhere on the page.

```html
<script src="https://unpkg.com/white-label-js"></script>
```

This will expose the global class `WhiteLabel`. After the page has been loaded, initialize an instance providing your White Label **client id**.

```javascript
var wl = new WhiteLabel(CLIENT_ID);
```

### NPM Library

`npm i --save white-label-js`

```javascript
var WhiteLabel = require('white-label-js');
var wl = new WhiteLabel(CLIENT_ID);
```

_This library requires the `regeneratorRuntime` method to be available. It is available in ES6 but can be loaded by using the [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)._

## Examples

Getting array of all Mixtape objects in the collection with slug "collection-slug"

```javascript
wl.getCollectionMixtapes("collection-slug", {
    all: true, 
    results: true
}).then(function(mixtapes) {
  // Do something with array of mixtapes
});
```

Get array of Track objects for mixtape with slug "mixtape-slug"

```javascript
wl.getMixtapeTracks("mixtape-slug", {
    results: true
}).then(function(tracks) {
  // Do something with array of tracks
});
```

Get all mixtapes for a collection with slug "collection-slug" ordered by mixtape title descending.

```javascript
wl.getCollectionMixtapes("collection-slug", {
    all: true, 
    results: true, 
    filters: {
        ordering: "-title"
    }
}).then(function(mixtapes) {
    // Do something with array of mixtapes
});
```

Get array of all tracks from artist "Cool Artist"

```javascript
wl.getAllTracks({
    results: true,
    all: true,
    filters: {
        search: "Cool Artist"
    } 
}).then(function(tracks) {
    // Do something with array of tracks    
});
```

Get array of first 20 Mixtape _responses_ in the collection with slug "collection-slug". _Note: each item in the array will contain a `count`, `next`, `previous` and `results` field_

```javascript
wl.getCollectionMixtapes("collection-slug").then(function(mixtapes) {
  // Do something with array of mixtapes
});
```

## Documentation

This library returns [Promise's](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for all of its methods. They will resolve when the request is successful and reject with any errors.

All requests take in an optional options object as the last parameter. Options has the following defaults, which is overridden when an object is provided.

```javascript
options = {
    page: 1,
    all: false,
    results: false,
    filters: {}
}
```

- **page**: The page to request when fetching from White Label API. Results are paginated every 20 records.
- **all**: Whether or not to recursively follow the next url in the response. If `page=1` and `all=true` then method will resolve with an array of all results from the collection.
- **results**: If true, the method will resolve with `result.results` _(if exists)_ from the White Label API. This is useful if you just want a flat array of collections/mixtapes/tracks when requesting your Collections, Mixtapes, or Tracks.
    + If `all=true` and `results=true`, the method will return a flat array of all results from the requests endpoint.
- **filters**: An object containing all white label filters to use with the API request. Common filters include [_ordering_](http://whitelabel.cool/docs/api/reference/#a-note-on-ordering) and _search_

_To clarify what the results option does: In some responses from the White Label API, there is a `count`, `next`, `previous` and `results` field. If `results` is `true`, the method will only return what is in the `results` array._

All of the methods use either the collection/mixtape/track `id` or `slug` as parameters.

### `getAllCollections(options)`

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#collections)

[*Filters for this method*](http://whitelabel.cool/docs/api/reference/#filters)

### `getCollection(collection, options)`

`collection` is a Collection id or slug.

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#collectionscollection)

### `getAllMixtapes(options)`

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#mixtapes)

[*Filters for this method*](http://whitelabel.cool/docs/api/reference/#filters_1)

### `getCollectionMixtapes(collection, options)`

`collection` is a Collection id or slug.

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#mixtapes)

[*Filters for this method*](http://whitelabel.cool/docs/api/reference/#filters_1)

### `getMixtape(mixtape, options)`

`mixtape` is a Mixtape id or slug.

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#mixtapesmixtape)

### `getAllTracks(options)`

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#tracks)

[*Filters for this method*](http://whitelabel.cool/docs/api/reference/#filters_2)

### `getMixtapeTracks(mixtape, options)`

`mixtape` is a Mixtape id or slug.

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#trackstrack)

[*Filters for this method*](http://whitelabel.cool/docs/api/reference/#filters_2)

### `getTrack(track, options)`

`track` is a Track id or slug.

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#trackstrack)

### `recordPlay(track)`

`track` is a Track id or slug.

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#eventsplaystrack)

## Development

To start contributing to this repository please follow these steps

1. Ensure you have [`yarn`](https://github.com/yarnpkg/yarn) installed globally. `npm i -g yarn`
2. Clone this repo. `git clone https://github.com/NoonPacific/White-Label-JS.git`
3. Navigate to cloned directory. `cd White-Label-JS`
5. Install dependencies. `yarn install`
6. Copy `public/secrets_example.js` to `public/secrets.js` and fill in your `CLIENT_ID`
7. Start the development server which watches the source directory. `npm run dev`
8. In a new terminal tab start the testing server. This serves the current directory which is used for testing the library in the browser. `npm run sandbox`
9. Navigate to [localhost:8080/public](http://localhost:8080/public) and open the developer console. You should see the results from the library.
10. Run `npm run build` to create a minified file which is used for production. This can be found at `lib/whiteLabel.min.js`.

All source files are in `src/` and generated JavaScript files to be used in the browser are in `lib/`. The source is built with [Webpack](https://webpack.github.io/) and uses mutliple [ES6](https://github.com/lukehoban/es6features) features as well as [ES7 Async/Await](http://rossboucher.com/await).

## Tests

Before running any tests you need to provide your White Label Client ID. Copy `public/secrets_example.js` to `public/secrets.js` and fill in your `CLIENT_ID`.

Run tests with `npm test`. All tests are located in `test/` and are run with mocha and tested in phantomjs. `test/test.html` can be opened in the browser to run the tests against that specific browser.
