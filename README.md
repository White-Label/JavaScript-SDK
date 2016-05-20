# WhiteLabel.js

Create a music platform on the web with WhiteLabel.js

## Usage

Include this script tag somewhere on the page.

```html
<script src="{TBD}/WhiteLabel.min.js"></script>
```

This will expose the global class `WhiteLabel`. After the page has been loaded, initialize an instance providing your WhiteLabel **client id**.

```javascript
var wl = new WhiteLabel(CLIENT_ID);
```

## Documentation

This library returns [Promise's](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for all of its methods. They will resolve when the request is successfully and reject with any errors.

All requests take in an optional options object as the last parameter. Options has the following defaults, which is overridden when an object is provided.

```javascript
options = {
    page: 1,
    all: false,
    results: false
}
```

- **page**: The page to request when fetching from White Label API. Results are paginated every 20 records
- **all**: Whether or not to recursively follow the next url in the response. If `page=1` and `all=true` then method will resolve with an array of all results from the collection.
- **results**: If true, the method will resolve with `result.results` _(if exists)_ from the White Label API. This is useful if you just want the array of collections when requesting your Collections, Mixtapes, or Tracks.
    + If `all=true` and `results=true`, the method will return a flat array of all collections from the requests endpoint.

### `getAllCollections(options)`

[**API endpoint**](http://whitelabel.cool/docs/api/reference/#get-information-about-multiple-collections)

### `getCollection(collection, options)`

**[API endpoint**](http://whitelabel.cool/docs/api/reference/#get-information-about-a-specific-collection)

### `getCollectionMixtapes(collection, options)`

**[API endpoint**](http://whitelabel.cool/docs/api/reference/#get-information-about-multiple-mixtapes)

### `getAllMixtapes(options)`

**[API endpoint**](http://whitelabel.cool/docs/api/reference/#get-information-about-multiple-mixtapes)

### `getMixtape(mixtape, options)`

**[API endpoint**](http://whitelabel.cool/docs/api/reference/#get-information-about-a-specific-mixtape)

### `getMixtapeTracks(mixtape, options)`

**[API endpoint**](http://whitelabel.cool/docs/api/reference/#get-information-about-multiple-tracks)

### `getAllTracks(options)`

**[API endpoint**](http://whitelabel.cool/docs/api/reference/#get-information-about-multiple-tracks)

### `getTrack(track, options)`

**[API endpoint**](http://whitelabel.cool/docs/api/reference/#get-information-about-a-specific-track)

### `recordPlay(track)`

**[API endpoint**](http://whitelabel.cool/docs/api/reference/#record-a-play-event)
