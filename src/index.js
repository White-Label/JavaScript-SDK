import request from 'request';
import cheerio from 'cheerio';
import Promise from 'bluebird';

const WIKI_RANDOM = 'https://en.wikipedia.org/wiki/Special:Random';
const WIKI_API = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=';

export default {
    factLengthLimit: 200,

    getRandomFact: function() {
        return new Promise((resolve, reject) => {
            this.getRandomRandomArticleTitle().then((articleTitle) => {
                let titleQuery = articleTitle.split(' ').join('%20');
                request(WIKI_API + titleQuery, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        let json = JSON.parse(body);
                        let keys = Object.keys(json.query.pages);
                        if (keys.length === 0) {
                            return this.getRandomFact();
                        } else {
                            let page = json.query.pages[keys[0]];
                            let fact = page.extract;
                            if (!fact || fact === '') {
                                return this.getRandomFact();
                            } else {
                                if (fact.length > this.factLengthLimit) {
                                    let factSplits = fact.split('.');
                                    fact = factSplits[0] += '.';
                                    if (fact.length < this.factLengthLimit && factSplits.length > 1) {
                                        fact += factSplits[1] + '.';
                                    }
                                }
                                resolve(fact);
                            }
                        }
                    } else {
                        reject(error);
                    }
                });
            });
        });
    },

    getRandomRandomArticleTitle: function() {
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
