(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("request"), require("cheerio"), require("bluebird"));
	else if(typeof define === 'function' && define.amd)
		define("wikifakt", ["request", "cheerio", "bluebird"], factory);
	else if(typeof exports === 'object')
		exports["wikifakt"] = factory(require("request"), require("cheerio"), require("bluebird"));
	else
		root["wikifakt"] = factory(root["request"], root["cheerio"], root["bluebird"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _request = __webpack_require__(1);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _cheerio = __webpack_require__(2);
	
	var _cheerio2 = _interopRequireDefault(_cheerio);
	
	var _bluebird = __webpack_require__(3);
	
	var _bluebird2 = _interopRequireDefault(_bluebird);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var WIKI_RANDOM = 'https://en.wikipedia.org/wiki/Special:Random';
	var WIKI_API = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=';
	
	exports.default = {
	    factLengthLimit: 200,
	    preload: true,
	    preloadedFact: '',
	
	    getRandomFact: function getRandomFact() {
	        var _this = this;
	
	        var preloading = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	        return new _bluebird2.default(function (resolve, reject) {
	            var sentFact = false;
	            if (_this.preload && _this.preloadedFact !== '') {
	                sentFact = true;
	                resolve(_this.preloadedFact);
	                _this.preloadedFact = '';
	            }
	
	            _this.getRandomArticleTitle().then(function (articleTitle) {
	                var titleQuery = articleTitle.split(' ').join('%20');
	                (0, _request2.default)(WIKI_API + titleQuery, function (error, response, body) {
	                    if (!error && response.statusCode === 200 && body !== '') {
	                        var json = JSON.parse(body);
	                        var keys = Object.keys(json.query.pages);
	                        if (keys.length === 0) {
	                            return _this.getRandomFact();
	                        } else {
	                            var page = json.query.pages[keys[0]];
	                            var fact = page.extract;
	                            if (!fact || fact === '') {
	                                _this.getRandomFact(preloading).then(function (newFact) {
	                                    resolve(newFact);
	                                });
	                            } else {
	                                if (fact.length > _this.factLengthLimit) {
	                                    var factSplits = fact.split('.');
	                                    fact = factSplits[0] += '.';
	                                    if (fact.length < _this.factLengthLimit && factSplits.length > 1) {
	                                        fact += factSplits[1] + '.';
	                                    }
	                                }
	
	                                // already returned a fact
	                                // save new fact in preload
	                                if (sentFact) {
	                                    _this.preloadedFact = fact;
	                                } else {
	                                    resolve(fact);
	
	                                    // if we want to preload a fact for next time
	                                    // and we arent currently preloading one
	                                    // then get a new fact and cache it in preloadedFact field
	                                    if (!preloading && _this.preload && _this.preloadedFact === '') {
	                                        _this.getRandomFact(true).then(function (newFact) {
	                                            _this.preloadedFact = newFact;
	                                        });
	                                    }
	                                }
	                            }
	                        }
	                    } else {
	                        if (!sentFact) {
	                            // there was an error fetching from wikipedia api
	                            // just try again
	                            _this.getRandomFact(preloading).then(function (fact) {
	                                resolve(fact);
	                            });
	                        }
	                    }
	                });
	            });
	        });
	    },
	
	    getRandomArticleTitle: function getRandomArticleTitle() {
	        return new _bluebird2.default(function (resolve, reject) {
	            (0, _request2.default)(WIKI_RANDOM, function (error, response, body) {
	                if (!error && response.statusCode === 200) {
	                    var $ = _cheerio2.default.load(body);
	                    var articleTitle = $('#firstHeading').text();
	                    resolve(articleTitle);
	                } else {
	                    reject(error);
	                }
	            });
	        });
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=wikifakt.js.map