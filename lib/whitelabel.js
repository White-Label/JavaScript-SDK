'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _merge = require('merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WhiteLabelAPI = function () {
    function WhiteLabelAPI(clientId) {
        _classCallCheck(this, WhiteLabelAPI);

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

        this.request = _axios2.default.create({
            baseURL: this.BASE_URL,
            timeout: 10000,
            headers: {
                Accept: 'application/json; version=1.0',
                Client: clientId
            }
        });
    }

    // Fix any double /'s that may occur when joining paths


    _createClass(WhiteLabelAPI, [{
        key: 'normalizePath',
        value: function normalizePath(path) {
            return path.split('//').join('/');
        }

        // ES7 async and await 🔥

    }, {
        key: 'getFetch',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                    page: 1,
                    all: false,
                    results: false,
                    filters: {}
                };

                var results, config, checkSuccess, response, returnResults, _ref2, flattened, mappedResults;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!options.filters) options.filters = {};

                                results = [];
                                config = {
                                    params: (0, _merge2.default)({ page: options.page }, options.filters)
                                };

                                // Throws an error if the request was unsuccessful
                                // The error can be caught in the .catch of a Promise

                                checkSuccess = function checkSuccess(response) {
                                    if (response.status !== 200) {
                                        throw new Error('Status code was ' + response.status);
                                    }
                                };

                                _context.next = 6;
                                return this.request.get(this.normalizePath(path + '/'), config);

                            case 6:
                                response = _context.sent;

                                checkSuccess(response);

                                response = response.data;
                                results.push(response);

                                // Follow the next field of response until null

                                if (!(options.all && response.next)) {
                                    _context.next = 21;
                                    break;
                                }

                                delete config.params.path;

                            case 12:
                                if (!(response && response.next)) {
                                    _context.next = 21;
                                    break;
                                }

                                _context.next = 15;
                                return this.request.get(response.next, config);

                            case 15:
                                response = _context.sent;

                                checkSuccess(response);

                                response = response.data;
                                results.push(response);
                                _context.next = 12;
                                break;

                            case 21:
                                returnResults = !options.all ? results[0] : results;

                                // if options.results is true, we will return a flat array of all
                                // results arrays from white label api.
                                // This is useful if you set options.all and (for example) fetch all
                                // of a collection mixtapes.

                                if (options.results) {
                                    if (options.all) {
                                        flattened = false;
                                        mappedResults = returnResults.map(function (obj) {
                                            flattened = obj.results !== undefined && obj.results !== null;
                                            return obj.results ? obj.results : obj;
                                        });

                                        returnResults = flattened ? (_ref2 = []).concat.apply(_ref2, _toConsumableArray(mappedResults)) : mappedResults;
                                    } else {
                                        returnResults = returnResults.results ? returnResults.results : returnResults;
                                    }
                                }
                                return _context.abrupt('return', returnResults);

                            case 24:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getFetch(_x2) {
                return _ref.apply(this, arguments);
            }

            return getFetch;
        }()
    }, {
        key: 'getAllCollections',
        value: function getAllCollections(options) {
            return this.getFetch(this.COLLECTIONS, options);
        }
    }, {
        key: 'getCollection',
        value: function getCollection(collection, options) {
            return this.getFetch(this.COLLECTIONS + collection, options);
        }
    }, {
        key: 'getAllMixtapes',
        value: function getAllMixtapes(options) {
            return this.getFetch(this.MIXTAPES, options);
        }
    }, {
        key: 'getCollectionMixtapes',
        value: function getCollectionMixtapes(collection, options) {
            options = _merge2.default.recursive(options, {
                filters: {
                    collection: collection
                }
            });
            return this.getFetch(this.MIXTAPES, options);
        }
    }, {
        key: 'getMixtape',
        value: function getMixtape(mixtape, options) {
            return this.getFetch(this.MIXTAPES + mixtape, options);
        }
    }, {
        key: 'getLatestMixtape',
        value: function getLatestMixtape() {
            return this.getFetch(this.LATEST_MIXTAPE);
        }
    }, {
        key: 'getAllTracks',
        value: function getAllTracks(options) {
            return this.getFetch(this.TRACKS, options);
        }
    }, {
        key: 'getMixtapeTracks',
        value: function getMixtapeTracks(mixtape, options) {
            options = _merge2.default.recursive(options, {
                filters: {
                    mixtape: mixtape
                }
            });
            return this.getFetch(this.TRACKS, options);
        }
    }, {
        key: 'getTrack',
        value: function getTrack(track, options) {
            return this.getFetch(this.TRACKS + track, options);
        }
    }, {
        key: 'recordPlay',
        value: function recordPlay(track) {
            return this.request.post(this.RECORD + track + '/');
        }
    }]);

    return WhiteLabelAPI;
}();

exports.default = WhiteLabelAPI;
module.exports = exports['default'];

//# sourceMappingURL=data:application/json;base64,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S0FBSyxNQUFuQixFQUEyQixPQUEzQixDQUFQO0FBQ0g7OztpQ0FFUSxLLEVBQU8sTyxFQUFTO0FBQ3JCLG1CQUFPLEtBQUssUUFBTCxDQUFjLEtBQUssTUFBTCxHQUFjLEtBQTVCLEVBQW1DLE9BQW5DLENBQVA7QUFDSDs7O21DQUVVLEssRUFBTztBQUNkLG1CQUFPLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsS0FBSyxNQUFMLEdBQWMsS0FBZCxHQUFzQixHQUF4QyxDQUFQO0FBQ0g7Ozs7OztrQkFHVSxhIiwiZmlsZSI6IndoaXRlbGFiZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IG1lcmdlIGZyb20gJ21lcmdlJztcblxuY2xhc3MgV2hpdGVMYWJlbEFQSSB7XG4gICAgY29uc3RydWN0b3IoY2xpZW50SWQpIHtcbiAgICAgICAgLy8gRGVmaW5lIEFQSSBlbmRwb2ludHNcbiAgICAgICAgdGhpcy5CQVNFX1VSTCA9ICdodHRwczovL2JldGEud2hpdGVsYWJlbC5jb29sL2FwaSc7XG4gICAgICAgIHRoaXMuQ09MTEVDVElPTlMgPSAnL2NvbGxlY3Rpb25zLyc7XG4gICAgICAgIHRoaXMuTUlYVEFQRVMgPSAnL21peHRhcGVzLyc7XG4gICAgICAgIHRoaXMuTEFURVNUX01JWFRBUEUgPSAnL21peHRhcGVzL2xhdGVzdC8nO1xuICAgICAgICB0aGlzLlRSQUNLUyA9ICcvdHJhY2tzLyc7XG4gICAgICAgIHRoaXMuUkVDT1JEID0gJy9ldmVudHMvcGxheXMvJztcbiAgICAgICAgdGhpcy5DTElFTlRfSUQgPSBjbGllbnRJZDtcblxuICAgICAgICBpZiAoIWNsaWVudElkIHx8IGNsaWVudElkID09PSAnJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBwcm92aWRlIGEgdmFsaWQgY2xpZW50IGlkJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlcXVlc3QgPSBheGlvcy5jcmVhdGUoe1xuICAgICAgICAgICAgYmFzZVVSTDogdGhpcy5CQVNFX1VSTCxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb247IHZlcnNpb249MS4wJyxcbiAgICAgICAgICAgICAgICBDbGllbnQ6IGNsaWVudElkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEZpeCBhbnkgZG91YmxlIC8ncyB0aGF0IG1heSBvY2N1ciB3aGVuIGpvaW5pbmcgcGF0aHNcbiAgICBub3JtYWxpemVQYXRoKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoJy8vJykuam9pbignLycpO1xuICAgIH1cblxuICAgIC8vIEVTNyBhc3luYyBhbmQgYXdhaXQg8J+UpVxuICAgIGFzeW5jIGdldEZldGNoKFxuICAgICAgICBwYXRoLFxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgIGFsbDogZmFsc2UsXG4gICAgICAgICAgICByZXN1bHRzOiBmYWxzZSxcbiAgICAgICAgICAgIGZpbHRlcnM6IHt9XG4gICAgICAgIH1cbiAgICApIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLmZpbHRlcnMpIG9wdGlvbnMuZmlsdGVycyA9IHt9O1xuXG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIHBhcmFtczogbWVyZ2UoeyBwYWdlOiBvcHRpb25zLnBhZ2UgfSwgb3B0aW9ucy5maWx0ZXJzKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRocm93cyBhbiBlcnJvciBpZiB0aGUgcmVxdWVzdCB3YXMgdW5zdWNjZXNzZnVsXG4gICAgICAgIC8vIFRoZSBlcnJvciBjYW4gYmUgY2F1Z2h0IGluIHRoZSAuY2F0Y2ggb2YgYSBQcm9taXNlXG4gICAgICAgIGNvbnN0IGNoZWNrU3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXR1cyBjb2RlIHdhcyAnICsgcmVzcG9uc2Uuc3RhdHVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnJlcXVlc3QuZ2V0KFxuICAgICAgICAgICAgdGhpcy5ub3JtYWxpemVQYXRoKHBhdGggKyAnLycpLFxuICAgICAgICAgICAgY29uZmlnXG4gICAgICAgICk7XG4gICAgICAgIGNoZWNrU3VjY2VzcyhyZXNwb25zZSk7XG5cbiAgICAgICAgcmVzcG9uc2UgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICByZXN1bHRzLnB1c2gocmVzcG9uc2UpO1xuXG4gICAgICAgIC8vIEZvbGxvdyB0aGUgbmV4dCBmaWVsZCBvZiByZXNwb25zZSB1bnRpbCBudWxsXG4gICAgICAgIGlmIChvcHRpb25zLmFsbCAmJiByZXNwb25zZS5uZXh0KSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLnBhcmFtcy5wYXRoO1xuICAgICAgICAgICAgd2hpbGUgKHJlc3BvbnNlICYmIHJlc3BvbnNlLm5leHQpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IHRoaXMucmVxdWVzdC5nZXQocmVzcG9uc2UubmV4dCwgY29uZmlnKTtcbiAgICAgICAgICAgICAgICBjaGVja1N1Y2Nlc3MocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmV0dXJuUmVzdWx0cyA9ICFvcHRpb25zLmFsbCA/IHJlc3VsdHNbMF0gOiByZXN1bHRzO1xuXG4gICAgICAgIC8vIGlmIG9wdGlvbnMucmVzdWx0cyBpcyB0cnVlLCB3ZSB3aWxsIHJldHVybiBhIGZsYXQgYXJyYXkgb2YgYWxsXG4gICAgICAgIC8vIHJlc3VsdHMgYXJyYXlzIGZyb20gd2hpdGUgbGFiZWwgYXBpLlxuICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCBpZiB5b3Ugc2V0IG9wdGlvbnMuYWxsIGFuZCAoZm9yIGV4YW1wbGUpIGZldGNoIGFsbFxuICAgICAgICAvLyBvZiBhIGNvbGxlY3Rpb24gbWl4dGFwZXMuXG4gICAgICAgIGlmIChvcHRpb25zLnJlc3VsdHMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFsbCkge1xuICAgICAgICAgICAgICAgIGxldCBmbGF0dGVuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXBwZWRSZXN1bHRzID0gcmV0dXJuUmVzdWx0cy5tYXAoZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYXR0ZW5lZCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoucmVzdWx0cyAhPT0gdW5kZWZpbmVkICYmIG9iai5yZXN1bHRzICE9PSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqLnJlc3VsdHMgPyBvYmoucmVzdWx0cyA6IG9iajtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm5SZXN1bHRzID0gZmxhdHRlbmVkXG4gICAgICAgICAgICAgICAgICAgID8gW10uY29uY2F0KC4uLm1hcHBlZFJlc3VsdHMpXG4gICAgICAgICAgICAgICAgICAgIDogbWFwcGVkUmVzdWx0cztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuUmVzdWx0cyA9IHJldHVyblJlc3VsdHMucmVzdWx0c1xuICAgICAgICAgICAgICAgICAgICA/IHJldHVyblJlc3VsdHMucmVzdWx0c1xuICAgICAgICAgICAgICAgICAgICA6IHJldHVyblJlc3VsdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHVyblJlc3VsdHM7XG4gICAgfVxuXG4gICAgZ2V0QWxsQ29sbGVjdGlvbnMob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGZXRjaCh0aGlzLkNPTExFQ1RJT05TLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRDb2xsZWN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmV0Y2godGhpcy5DT0xMRUNUSU9OUyArIGNvbGxlY3Rpb24sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldEFsbE1peHRhcGVzKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmV0Y2godGhpcy5NSVhUQVBFUywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0Q29sbGVjdGlvbk1peHRhcGVzKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG1lcmdlLnJlY3Vyc2l2ZShvcHRpb25zLCB7XG4gICAgICAgICAgICBmaWx0ZXJzOiB7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmV0Y2godGhpcy5NSVhUQVBFUywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0TWl4dGFwZShtaXh0YXBlLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZldGNoKHRoaXMuTUlYVEFQRVMgKyBtaXh0YXBlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRMYXRlc3RNaXh0YXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGZXRjaCh0aGlzLkxBVEVTVF9NSVhUQVBFKTtcbiAgICB9XG5cbiAgICBnZXRBbGxUcmFja3Mob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGZXRjaCh0aGlzLlRSQUNLUywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0TWl4dGFwZVRyYWNrcyhtaXh0YXBlLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBtZXJnZS5yZWN1cnNpdmUob3B0aW9ucywge1xuICAgICAgICAgICAgZmlsdGVyczoge1xuICAgICAgICAgICAgICAgIG1peHRhcGU6IG1peHRhcGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZldGNoKHRoaXMuVFJBQ0tTLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRUcmFjayh0cmFjaywgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGZXRjaCh0aGlzLlRSQUNLUyArIHRyYWNrLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZWNvcmRQbGF5KHRyYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QucG9zdCh0aGlzLlJFQ09SRCArIHRyYWNrICsgJy8nKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdoaXRlTGFiZWxBUEk7XG4iXX0=