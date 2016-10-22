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
                'Accept': 'application/json; version=1.0',
                'Client': clientId
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
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path) {
                var options = arguments.length <= 1 || arguments[1] === undefined ? {
                    page: 1,
                    all: false,
                    results: false,
                    filters: {}
                } : arguments[1];

                var results, config, checkSuccess, response, returnResults, _ref, flattened, mappedResults;

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

                                        returnResults = flattened ? (_ref = []).concat.apply(_ref, _toConsumableArray(mappedResults)) : mappedResults;
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

            function getFetch(_x, _x2) {
                return ref.apply(this, arguments);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNLGE7QUFDRiwyQkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQ2xCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLGtDQUFoQjtBQUNBLGFBQUssV0FBTCxHQUFtQixlQUFuQjtBQUNBLGFBQUssUUFBTCxHQUFnQixZQUFoQjtBQUNBLGFBQUssY0FBTCxHQUFzQixtQkFBdEI7QUFDQSxhQUFLLE1BQUwsR0FBYyxVQUFkO0FBQ0EsYUFBSyxNQUFMLEdBQWMsZ0JBQWQ7QUFDQSxhQUFLLFNBQUwsR0FBaUIsUUFBakI7O0FBRUEsWUFBSSxDQUFDLFFBQUQsSUFBYSxhQUFhLEVBQTlCLEVBQWtDO0FBQzlCLGtCQUFNLElBQUksS0FBSixDQUFVLG9DQUFWLENBQU47QUFDSDs7QUFFRCxhQUFLLE9BQUwsR0FBZSxnQkFBTSxNQUFOLENBQWE7QUFDeEIscUJBQVMsS0FBSyxRQURVO0FBRXhCLHFCQUFTLEtBRmU7QUFHeEIscUJBQVM7QUFDTCwwQkFBVSwrQkFETDtBQUVMLDBCQUFVO0FBRkw7QUFIZSxTQUFiLENBQWY7QUFRSDs7QUFFRDs7Ozs7c0NBQ2MsSSxFQUFNO0FBQ2hCLG1CQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsRUFBaUIsSUFBakIsQ0FBc0IsR0FBdEIsQ0FBUDtBQUNIOztBQUVEOzs7OztpRkFDZSxJO29CQUFNLE8seURBQVU7QUFDM0IsMEJBQU0sQ0FEcUI7QUFFM0IseUJBQUssS0FGc0I7QUFHM0IsNkJBQVMsS0FIa0I7QUFJM0IsNkJBQVM7QUFKa0IsaUI7O29CQVF2QixPLEVBQ0UsTSxFQU1BLFksRUFNRixRLEVBa0JBLGEsUUFRUSxTLEVBQ0UsYTs7Ozs7O0FBMUNkLG9DQUFJLENBQUMsUUFBUSxPQUFiLEVBQXNCLFFBQVEsT0FBUixHQUFrQixFQUFsQjs7QUFFbEIsdUMsR0FBVSxFO0FBQ1Isc0MsR0FBUztBQUNYLDRDQUFRLHFCQUFNLEVBQUMsTUFBTSxRQUFRLElBQWYsRUFBTixFQUE0QixRQUFRLE9BQXBDO0FBREcsaUM7O0FBSWY7QUFDQTs7QUFDTSw0QyxHQUFlLFNBQWYsWUFBZSxDQUFTLFFBQVQsRUFBbUI7QUFDcEMsd0NBQUksU0FBUyxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQ3pCLDhDQUFNLElBQUksS0FBSixDQUFVLHFCQUFxQixTQUFTLE1BQXhDLENBQU47QUFDSDtBQUNKLGlDOzs7dUNBRW9CLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsS0FBSyxhQUFMLENBQW1CLE9BQU8sR0FBMUIsQ0FBakIsRUFBaUQsTUFBakQsQzs7O0FBQWpCLHdDOztBQUNKLDZDQUFhLFFBQWI7O0FBRUEsMkNBQVcsU0FBUyxJQUFwQjtBQUNBLHdDQUFRLElBQVIsQ0FBYSxRQUFiOztBQUVBOztzQ0FDSSxRQUFRLEdBQVIsSUFBZSxTQUFTLEk7Ozs7O0FBQ3hCLHVDQUFPLE9BQU8sTUFBUCxDQUFjLElBQXJCOzs7c0NBQ08sWUFBWSxTQUFTLEk7Ozs7Ozt1Q0FDUCxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLFNBQVMsSUFBMUIsRUFBZ0MsTUFBaEMsQzs7O0FBQWpCLHdDOztBQUNBLDZDQUFhLFFBQWI7O0FBRUEsMkNBQVcsU0FBUyxJQUFwQjtBQUNBLHdDQUFRLElBQVIsQ0FBYSxRQUFiOzs7OztBQUlKLDZDLEdBQWdCLENBQUMsUUFBUSxHQUFULEdBQWUsUUFBUSxDQUFSLENBQWYsR0FBNEIsTzs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBQ0Esb0NBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ2pCLHdDQUFJLFFBQVEsR0FBWixFQUFpQjtBQUNULGlEQURTLEdBQ0csS0FESDtBQUVQLHFEQUZPLEdBRVMsY0FBYyxHQUFkLENBQWtCLFVBQVMsR0FBVCxFQUFjO0FBQ2xELHdEQUFhLElBQUksT0FBSixLQUFnQixTQUFoQixJQUE2QixJQUFJLE9BQUosS0FBZ0IsSUFBMUQ7QUFDQSxtREFBTyxJQUFJLE9BQUosR0FBYyxJQUFJLE9BQWxCLEdBQTRCLEdBQW5DO0FBQ0gseUNBSHFCLENBRlQ7O0FBTWIsd0RBQWdCLFlBQVksWUFBRyxNQUFILGdDQUFhLGFBQWIsRUFBWixHQUEwQyxhQUExRDtBQUNILHFDQVBELE1BT087QUFDSCx3REFBZ0IsY0FBYyxPQUFkLEdBQXdCLGNBQWMsT0FBdEMsR0FBZ0QsYUFBaEU7QUFDSDtBQUNKO2lFQUNNLGE7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQ0FHTyxPLEVBQVM7QUFDdkIsbUJBQU8sS0FBSyxRQUFMLENBQWMsS0FBSyxXQUFuQixFQUFnQyxPQUFoQyxDQUFQO0FBQ0g7OztzQ0FFYSxVLEVBQVksTyxFQUFTO0FBQy9CLG1CQUFPLEtBQUssUUFBTCxDQUFjLEtBQUssV0FBTCxHQUFtQixVQUFqQyxFQUE2QyxPQUE3QyxDQUFQO0FBQ0g7Ozt1Q0FFYyxPLEVBQVM7QUFDcEIsbUJBQU8sS0FBSyxRQUFMLENBQWMsS0FBSyxRQUFuQixFQUE2QixPQUE3QixDQUFQO0FBQ0g7Ozs4Q0FFcUIsVSxFQUFZLE8sRUFBUztBQUN2QyxzQkFBVSxnQkFBTSxTQUFOLENBQWdCLE9BQWhCLEVBQXlCO0FBQy9CLHlCQUFTO0FBQ0wsZ0NBQVk7QUFEUDtBQURzQixhQUF6QixDQUFWO0FBS0EsbUJBQU8sS0FBSyxRQUFMLENBQWMsS0FBSyxRQUFuQixFQUE2QixPQUE3QixDQUFQO0FBQ0g7OzttQ0FFVSxPLEVBQVMsTyxFQUFTO0FBQ3pCLG1CQUFPLEtBQUssUUFBTCxDQUFjLEtBQUssUUFBTCxHQUFnQixPQUE5QixFQUF1QyxPQUF2QyxDQUFQO0FBQ0g7OzsyQ0FFa0I7QUFDZixtQkFBTyxLQUFLLFFBQUwsQ0FBYyxLQUFLLGNBQW5CLENBQVA7QUFDSDs7O3FDQUVZLE8sRUFBUztBQUNsQixtQkFBTyxLQUFLLFFBQUwsQ0FBYyxLQUFLLE1BQW5CLEVBQTJCLE9BQTNCLENBQVA7QUFDSDs7O3lDQUVnQixPLEVBQVMsTyxFQUFTO0FBQy9CLHNCQUFVLGdCQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsRUFBeUI7QUFDL0IseUJBQVM7QUFDTCw2QkFBUztBQURKO0FBRHNCLGFBQXpCLENBQVY7QUFLQSxtQkFBTyxLQUFLLFFBQUwsQ0FBYyxLQUFLLE1BQW5CLEVBQTJCLE9BQTNCLENBQVA7QUFDSDs7O2lDQUVRLEssRUFBTyxPLEVBQVM7QUFDckIsbUJBQU8sS0FBSyxRQUFMLENBQWMsS0FBSyxNQUFMLEdBQWMsS0FBNUIsRUFBbUMsT0FBbkMsQ0FBUDtBQUNIOzs7bUNBRVUsSyxFQUFPO0FBQ2QsbUJBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFLLE1BQUwsR0FBYyxLQUFkLEdBQXNCLEdBQXhDLENBQVA7QUFDSDs7Ozs7O2tCQUdVLGEiLCJmaWxlIjoid2hpdGVsYWJlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgbWVyZ2UgZnJvbSAnbWVyZ2UnO1xuXG5jbGFzcyBXaGl0ZUxhYmVsQVBJIHtcbiAgICBjb25zdHJ1Y3RvcihjbGllbnRJZCkge1xuICAgICAgICAvLyBEZWZpbmUgQVBJIGVuZHBvaW50c1xuICAgICAgICB0aGlzLkJBU0VfVVJMID0gJ2h0dHBzOi8vYmV0YS53aGl0ZWxhYmVsLmNvb2wvYXBpJztcbiAgICAgICAgdGhpcy5DT0xMRUNUSU9OUyA9ICcvY29sbGVjdGlvbnMvJztcbiAgICAgICAgdGhpcy5NSVhUQVBFUyA9ICcvbWl4dGFwZXMvJztcbiAgICAgICAgdGhpcy5MQVRFU1RfTUlYVEFQRSA9ICcvbWl4dGFwZXMvbGF0ZXN0Lyc7XG4gICAgICAgIHRoaXMuVFJBQ0tTID0gJy90cmFja3MvJztcbiAgICAgICAgdGhpcy5SRUNPUkQgPSAnL2V2ZW50cy9wbGF5cy8nO1xuICAgICAgICB0aGlzLkNMSUVOVF9JRCA9IGNsaWVudElkO1xuXG4gICAgICAgIGlmICghY2xpZW50SWQgfHwgY2xpZW50SWQgPT09ICcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHByb3ZpZGUgYSB2YWxpZCBjbGllbnQgaWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgICAgICAgICBiYXNlVVJMOiB0aGlzLkJBU0VfVVJMLFxuICAgICAgICAgICAgdGltZW91dDogMTAwMDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uOyB2ZXJzaW9uPTEuMCcsXG4gICAgICAgICAgICAgICAgJ0NsaWVudCc6IGNsaWVudElkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRml4IGFueSBkb3VibGUgLydzIHRoYXQgbWF5IG9jY3VyIHdoZW4gam9pbmluZyBwYXRoc1xuICAgIG5vcm1hbGl6ZVBhdGgocGF0aCkge1xuICAgICAgICByZXR1cm4gcGF0aC5zcGxpdCgnLy8nKS5qb2luKCcvJyk7XG4gICAgfVxuXG4gICAgLy8gRVM3IGFzeW5jIGFuZCBhd2FpdCDwn5SlXG4gICAgYXN5bmMgZ2V0RmV0Y2gocGF0aCwgb3B0aW9ucyA9IHtcbiAgICAgICAgcGFnZTogMSxcbiAgICAgICAgYWxsOiBmYWxzZSxcbiAgICAgICAgcmVzdWx0czogZmFsc2UsXG4gICAgICAgIGZpbHRlcnM6IHt9XG4gICAgfSkge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZmlsdGVycykgb3B0aW9ucy5maWx0ZXJzID0ge307XG5cbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgICAgcGFyYW1zOiBtZXJnZSh7cGFnZTogb3B0aW9ucy5wYWdlfSwgb3B0aW9ucy5maWx0ZXJzKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRocm93cyBhbiBlcnJvciBpZiB0aGUgcmVxdWVzdCB3YXMgdW5zdWNjZXNzZnVsXG4gICAgICAgIC8vIFRoZSBlcnJvciBjYW4gYmUgY2F1Z2h0IGluIHRoZSAuY2F0Y2ggb2YgYSBQcm9taXNlXG4gICAgICAgIGNvbnN0IGNoZWNrU3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXR1cyBjb2RlIHdhcyAnICsgcmVzcG9uc2Uuc3RhdHVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnJlcXVlc3QuZ2V0KHRoaXMubm9ybWFsaXplUGF0aChwYXRoICsgJy8nKSwgY29uZmlnKTtcbiAgICAgICAgY2hlY2tTdWNjZXNzKHJlc3BvbnNlKTtcblxuICAgICAgICByZXNwb25zZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIHJlc3VsdHMucHVzaChyZXNwb25zZSk7XG5cbiAgICAgICAgLy8gRm9sbG93IHRoZSBuZXh0IGZpZWxkIG9mIHJlc3BvbnNlIHVudGlsIG51bGxcbiAgICAgICAgaWYgKG9wdGlvbnMuYWxsICYmIHJlc3BvbnNlLm5leHQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcucGFyYW1zLnBhdGg7XG4gICAgICAgICAgICB3aGlsZSAocmVzcG9uc2UgJiYgcmVzcG9uc2UubmV4dCkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgdGhpcy5yZXF1ZXN0LmdldChyZXNwb25zZS5uZXh0LCBjb25maWcpO1xuICAgICAgICAgICAgICAgIGNoZWNrU3VjY2VzcyhyZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXR1cm5SZXN1bHRzID0gIW9wdGlvbnMuYWxsID8gcmVzdWx0c1swXSA6IHJlc3VsdHM7XG5cbiAgICAgICAgLy8gaWYgb3B0aW9ucy5yZXN1bHRzIGlzIHRydWUsIHdlIHdpbGwgcmV0dXJuIGEgZmxhdCBhcnJheSBvZiBhbGxcbiAgICAgICAgLy8gcmVzdWx0cyBhcnJheXMgZnJvbSB3aGl0ZSBsYWJlbCBhcGkuXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIGlmIHlvdSBzZXQgb3B0aW9ucy5hbGwgYW5kIChmb3IgZXhhbXBsZSkgZmV0Y2ggYWxsXG4gICAgICAgIC8vIG9mIGEgY29sbGVjdGlvbiBtaXh0YXBlcy5cbiAgICAgICAgaWYgKG9wdGlvbnMucmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZsYXR0ZW5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHBlZFJlc3VsdHMgPSByZXR1cm5SZXN1bHRzLm1hcChmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhdHRlbmVkID0gKG9iai5yZXN1bHRzICE9PSB1bmRlZmluZWQgJiYgb2JqLnJlc3VsdHMgIT09IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqLnJlc3VsdHMgPyBvYmoucmVzdWx0cyA6IG9iajtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm5SZXN1bHRzID0gZmxhdHRlbmVkID8gW10uY29uY2F0KC4uLm1hcHBlZFJlc3VsdHMpIDogbWFwcGVkUmVzdWx0cztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuUmVzdWx0cyA9IHJldHVyblJlc3VsdHMucmVzdWx0cyA/IHJldHVyblJlc3VsdHMucmVzdWx0cyA6IHJldHVyblJlc3VsdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHVyblJlc3VsdHM7XG4gICAgfVxuXG4gICAgZ2V0QWxsQ29sbGVjdGlvbnMob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGZXRjaCh0aGlzLkNPTExFQ1RJT05TLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRDb2xsZWN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmV0Y2godGhpcy5DT0xMRUNUSU9OUyArIGNvbGxlY3Rpb24sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldEFsbE1peHRhcGVzKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmV0Y2godGhpcy5NSVhUQVBFUywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0Q29sbGVjdGlvbk1peHRhcGVzKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG1lcmdlLnJlY3Vyc2l2ZShvcHRpb25zLCB7XG4gICAgICAgICAgICBmaWx0ZXJzOiB7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmV0Y2godGhpcy5NSVhUQVBFUywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0TWl4dGFwZShtaXh0YXBlLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZldGNoKHRoaXMuTUlYVEFQRVMgKyBtaXh0YXBlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRMYXRlc3RNaXh0YXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGZXRjaCh0aGlzLkxBVEVTVF9NSVhUQVBFKTtcbiAgICB9XG5cbiAgICBnZXRBbGxUcmFja3Mob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGZXRjaCh0aGlzLlRSQUNLUywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0TWl4dGFwZVRyYWNrcyhtaXh0YXBlLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBtZXJnZS5yZWN1cnNpdmUob3B0aW9ucywge1xuICAgICAgICAgICAgZmlsdGVyczoge1xuICAgICAgICAgICAgICAgIG1peHRhcGU6IG1peHRhcGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZldGNoKHRoaXMuVFJBQ0tTLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRUcmFjayh0cmFjaywgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGZXRjaCh0aGlzLlRSQUNLUyArIHRyYWNrLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZWNvcmRQbGF5KHRyYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QucG9zdCh0aGlzLlJFQ09SRCArIHRyYWNrICsgJy8nKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdoaXRlTGFiZWxBUEk7XG4iXX0=