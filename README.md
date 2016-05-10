# wikifakt

[![Build Status](https://drone.io/github.com/coffee-cup/wikifakt/status.png)](https://drone.io/github.com/coffee-cup/wikifakt/latest)

Generate a random fact from [Wikipedia](https://en.wikipedia.org/wiki/Main_Page). All facts will be short, 1-3 sentences long. This api also allows you to get a random Wikipedia article title.

## Examples

#### Random facts

- Fermana Football Club is an Italian association football club, based in Fermo, Marche. It currently plays in Serie D.
- James Anthony Piersall (born November 14, 1929) is an American former baseball center fielder who played 17 seasons in Major League Baseball (MLB) for five teams, from 1950 through 1967. Piersall is best known for his well-publicized battle with bipolar disorder that became the subject of the book and movie Fear Strikes Out.
- Hypercompe eridanus is a moth of the Arctiidae family. It is found in Colombia, Surinam and French Guiana.
- Israel was represented in the Eurovision by David D'Or who sang the bilingual English / Hebrew song "Leha'amin" (Hebrew script: להאמין; English translation: "To Believe")
- Charles Lemercier de Longpre, baron d'Haussez (20 October 1778, Neufchâtel-en-Bray (Normandy) – 10 November 1854, Saint-Saëns (Seine-Maritime)) was a French politician and minister.
- Zalesie [zaˈlɛɕɛ] is a village in the administrative district of Gmina Wąsosz, within Grajewo County, Podlaskie Voivodeship, in north-eastern Poland. It lies approximately 7 kilometres (4 mi) east of Wąsosz, 14 km (9 mi) south of Grajewo, and 68 km (42 mi) north-west of the regional capital Białystok.

#### Random article titles

- Boxing News
- National Stadium (Palau)
- Snood (anatomy)
- Humane Order of African Redemption
- David Rankin (cricketer)

## Installation

```
npm i --save wikifakt
```

## Usage

WikiFakt exposes two functions which return promises.

- `getRandomFact`
- `getRandomRandomArticleTitle`

```javascript
var WikiFakt = require('wikifakt');

// Get a fact
WikiFakt.getRandomFact().then(function(fact) {
  console.log(fact);
});

// Get an article title
WikiFakt.getRandomArticleTitle().then(function(title) {
  console.log(title);
});
```

### Preloading

Getting facts requires making two HTTP GET requests _(one to get the random Wikipedia article, and a second to the Wikipedia api to get the content)_. Because of this, WikiFakt, by default, will preload facts. The first call to `getRandomFact` will actually fetch two facts and store the second for later use. Subsequent calls to `getRandomFact` will immediatly return the preloaded fact without needing to make any HTTP requests. In the background, _after the fact has already been returned_, a new fact will be fetched and preloaded. This will speed up getting facts from the API if you expect to be using it multiple times.

Preloading can be disabled with

```javascript
WikiFakt.preload = false;
```
