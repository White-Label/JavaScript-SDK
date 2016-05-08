import request from 'request';
import cheerio from 'cheerio';
import Promise from 'bluebird';

const WIKI_RANDOM = 'https://en.wikipedia.org/wiki/Special:Random';
const WIKI_API = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=';

export default {
    factLengthLimit: 200,
    preload: true,
    preloadedFact: '',

    getRandomFact: function(preloading = false) {
        return new Promise((resolve, reject) => {
            let sentFact = false;
            if (this.preload && this.preloadedFact !== '') {
                sentFact = true;
                resolve(this.preloadedFact);
                this.preloadedFact = '';
            }

            this.getRandomArticleTitle().then((articleTitle) => {
                let titleQuery = articleTitle.split(' ').join('%20');
                request(WIKI_API + titleQuery, (error, response, body) => {
                    if (!error && response.statusCode === 200 && body !== '') {
                        let json = JSON.parse(body);
                        let keys = Object.keys(json.query.pages);
                        if (keys.length === 0) {
                            return this.getRandomFact();
                        } else {
                            let page = json.query.pages[keys[0]];
                            let fact = page.extract;
                            if (!fact || fact === '') {
                                this.getRandomFact(preloading).then((newFact) => {
                                    resolve(newFact);
                                });
                            } else {
                                if (fact.length > this.factLengthLimit) {
                                    let factSplits = fact.split('.');
                                    fact = factSplits[0] += '.';
                                    if (fact.length < this.factLengthLimit && factSplits.length > 1) {
                                        fact += factSplits[1] + '.';
                                    }
                                }

                                // already returned a fact
                                // save new fact in preload
                                if (sentFact) {
                                    this.preloadedFact = fact;
                                } else {
                                    resolve(fact);

                                    // if we want to preload a fact for next time
                                    // and we arent currently preloading one
                                    // then get a new fact and cache it in preloadedFact field
                                    if (!preloading && this.preload && this.preloadedFact === '') {
                                        this.getRandomFact(true).then((newFact) => {
                                            this.preloadedFact = newFact;
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        if (!sentFact) {
                            // there was an error fetching from wikipedia api
                            // just try again
                            this.getRandomFact(preloading).then((fact) => {
                                resolve(fact);
                            });
                        }
                    }
                });
            });
        });
    },

    getRandomArticleTitle: function() {
        return new Promise((resolve, reject) => {
            request(WIKI_RANDOM, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    let $ = cheerio.load(body);
                    let articleTitle = $('#firstHeading').text();
                    resolve(articleTitle);
                } else {
                    reject(error);
                }
            });
        });
    }
};
