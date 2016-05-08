import chai from 'chai';
import Promise from 'bluebird';

import WikiFakt from '../lib/wikifakt.min.js';

chai.expect();

const expect = chai.expect;

var lib;

describe('WikiFakts getting article titles and facts', function() {
    this.timeout(10000);

    it('Should give me random title names', function(done) {
        let title1Promise = WikiFakt.getRandomArticleTitle();
        let title2Promise = WikiFakt.getRandomArticleTitle();

        expect(title1Promise).to.not.be.null;
        expect(title2Promise).to.not.be.null;

        Promise.join(title1Promise, title2Promise,
            (title1, title2) => {
                expect(title1).to.not.be.null;
                expect(title1).to.not.be.equal('');

                expect(title2).to.not.be.null;
                expect(title2).to.not.be.equal('');

                expect(title1).to.not.be.equal(title2);

                done();
            });
    });

    it('Should give me a random fact', function(done) {
        WikiFakt.getRandomFact().then(function(fact) {
            expect(fact).to.not.be.null;
            expect(fact).to.not.be.equal('');

            done();
        });
    });
});

describe('WikiFakts preloading', function() {
    this.timeout(10000);

    it('Should preload facts', function(done) {
        WikiFakt.preload = true;
        WikiFakt.preloadedFact = '';

        expect(WikiFakt.preload).to.be.true;
        expect(WikiFakt.preloadedFact).to.be.equal('');

        WikiFakt.getRandomFact().then(function(fact) {
            expect(fact).to.not.be.null;

            // wait for preloaded fact to load
            setTimeout(() => {
                expect(WikiFakt.preloadedFact).to.not.be.equal('');

                done();
            }, 2000);
        });
    });

    it('Should use preloaded fact', function(done) {
        var testFact = 'Fact';

        WikiFakt.preload = true;
        WikiFakt.preloadedFact = testFact;

        WikiFakt.getRandomFact().then(function(fact) {
            expect(fact).to.be.equal(testFact);

            done();
        });
    });
});
