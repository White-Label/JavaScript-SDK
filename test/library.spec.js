import chai from 'chai';
import Promise from 'bluebird';

import WikiFakt from '../lib/wikifakt.min.js';

chai.expect();

const expect = chai.expect;

var lib;

describe('WikiFakts', function() {
    this.timeout(10000);

    it('Should give me random title names', function(done) {
        let title1Promise = WikiFakt.getRandomRandomArticleTitle();
        let title2Promise = WikiFakt.getRandomRandomArticleTitle();

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
            console.log(fact);

            expect(fact).to.not.be.null;

            expect(fact).to.not.be.equal('');

            done();
        });
    });
});
