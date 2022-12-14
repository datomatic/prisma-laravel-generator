import matchCase from './match-case';

// Aligned to 2.0.4 (commit #83f4d84 https://github.com/doctrine/inflector/commit/83f4d84a0f28d6caf957a30ca8b2cfe2a65f0b86) of doctrine/inflector

const uninflected: RegExp[] = [
  // from laravel https://github.com/laravel/framework/blob/93a1296bca43c1ca8dcb5df8f97107e819a71499/src/Illuminate/Support/Pluralizer.php
  /^cattle$/i,
  /^kin$/i,
  /^recommended$/i,
  /^related$/i,
  // from getSingular https://github.com/doctrine/inflector/blob/2.0.x/lib/Doctrine/Inflector/Rules/English/Uninflected.php
  /^.*ss$/i,
  /^clothes$/i,
  /^data$/i,
  /^fascia$/i,
  /^fuchsia$/i,
  /^galleria$/i,
  /^mafia$/i,
  /^militia$/i,
  /^pants$/i,
  /^petunia$/i,
  /^sepia$/i,
  /^trivia$/i,
  /^utopia$/i,
  // from getDefault https://github.com/doctrine/inflector/blob/2.0.x/lib/Doctrine/Inflector/Rules/English/Uninflected.php
  /^\w+media$/i,
  /^advice$/i,
  /^aircraft$/i,
  /^amoyese$/i,
  /^art$/i,
  /^audio$/i,
  /^baggage$/i,
  /^bison$/i,
  /^borghese$/i,
  /^bream$/i,
  /^breeches$/i,
  /^britches$/i,
  /^buffalo$/i,
  /^butter$/i,
  /^cantus$/i,
  /^carp$/i,
  /^cattle$/i,
  /^chassis$/i,
  /^clippers$/i,
  /^clothing$/i,
  /^coal$/i,
  /^cod$/i,
  /^coitus$/i,
  /^compensation$/i,
  /^congoese$/i,
  /^contretemps$/i,
  /^coreopsis$/i,
  /^corps$/i,
  /^cotton$/i,
  /^data$/i,
  /^debris$/i,
  /^deer$/i,
  /^diabetes$/i,
  /^djinn$/i,
  /^education$/i,
  /^eland$/i,
  /^elk$/i,
  /^emoji$/i,
  /^equipment$/i,
  /^evidence$/i,
  /^faroese$/i,
  /^feedback$/i,
  /^fish$/i,
  /^flounder$/i,
  /^flour$/i,
  /^foochowese$/i,
  /^food$/i,
  /^furniture$/i,
  /^gallows$/i,
  /^genevese$/i,
  /^genoese$/i,
  /^gilbertese$/i,
  /^gold$/i,
  /^headquarters$/i,
  /^herpes$/i,
  /^hijinks$/i,
  /^homework$/i,
  /^hottentotese$/i,
  /^impatience$/i,
  /^information$/i,
  /^innings$/i,
  /^jackanapes$/i,
  /^jeans$/i,
  /^jedi$/i,
  /^kin$/i,
  /^kiplingese$/i,
  /^knowledge$/i,
  /^kongoese$/i,
  /^leather$/i,
  /^love$/i,
  /^lucchese$/i,
  /^luggage$/i,
  /^mackerel$/i,
  /^maltese$/i,
  /^management$/i,
  /^metadata$/i,
  /^mews$/i,
  /^money$/i,
  /^moose$/i,
  /^mumps$/i,
  /^music$/i,
  /^nankingese$/i,
  /^news$/i,
  /^nexus$/i,
  /^niasese$/i,
  /^nutrition$/i,
  /^offspring$/i,
  /^oil$/i,
  /^patience$/i,
  /^pekingese$/i,
  /^piedmontese$/i,
  /^pincers$/i,
  /^pistoiese$/i,
  /^plankton$/i,
  /^pliers$/i,
  /^pokemon$/i,
  /^police$/i,
  /^polish$/i,
  /^portuguese$/i,
  /^proceedings$/i,
  /^progress$/i,
  /^rabies$/i,
  /^rain$/i,
  /^research$/i,
  /^rhinoceros$/i,
  /^rice$/i,
  /^salmon$/i,
  /^sand$/i,
  /^sarawakese$/i,
  /^scissors$/i,
  /^sea[ -]bass$/i,
  /^series$/i,
  /^shavese$/i,
  /^shears$/i,
  /^sheep$/i,
  /^siemens$/i,
  /^silk$/i,
  /^sms$/i,
  /^soap$/i,
  /^social media$/i,
  /^spam$/i,
  /^species$/i,
  /^staff$/i,
  /^sugar$/i,
  /^swine$/i,
  /^talent$/i,
  /^toothpaste$/i,
  /^traffic$/i,
  /^travel$/i,
  /^trousers$/i,
  /^trout$/i,
  /^tuna$/i,
  /^us$/i,
  /^vermontese$/i,
  /^vinegar$/i,
  /^weather$/i,
  /^wenchowese$/i,
  /^wheat$/i,
  /^whiting$/i,
  /^wildebeest$/i,
  /^wood$/i,
  /^wool$/i,
  /^yengeese$/i,
];

const irregular: [RegExp, string][] = [
  // from getIrregular https://github.com/doctrine/inflector/blob/2.0.x/lib/Doctrine/Inflector/Rules/English/Inflectible.php
  [/^atlases$/i, 'atlas'],
  [/^axes$/i, 'axe'],
  [/^beefs$/i, 'beef'],
  [/^brothers$/i, 'brother'],
  [/^cafes$/i, 'cafe'],
  [/^chateaux$/i, 'chateau'],
  [/^niveaux$/i, 'niveau'],
  [/^children$/i, 'child'],
  [/^canvases$/i, 'canvas'],
  [/^cookies$/i, 'cookie'],
  [/^corpuses$/i, 'corpus'],
  [/^cows$/i, 'cow'],
  [/^criteria$/i, 'criterion'],
  [/^curricula$/i, 'curriculum'],
  [/^demos$/i, 'demo'],
  [/^dominoes$/i, 'domino'],
  [/^echoes$/i, 'echo'],
  [/^feet$/i, 'foot'],
  [/^fungi$/i, 'fungus'],
  [/^ganglions$/i, 'ganglion'],
  [/^gases$/i, 'gas'],
  [/^genies$/i, 'genie'],
  [/^genera$/i, 'genus'],
  [/^geese$/i, 'goose'],
  [/^graffiti$/i, 'graffito'],
  [/^hippopotami$/i, 'hippopotamus'],
  [/^hoofs$/i, 'hoof'],
  [/^humans$/i, 'human'],
  [/^irises$/i, 'iris'],
  [/^larvae$/i, 'larva'],
  [/^leaves$/i, 'leaf'],
  [/^lenses$/i, 'lens'],
  [/^loaves$/i, 'loaf'],
  [/^men$/i, 'man'],
  [/^media$/i, 'medium'],
  [/^memoranda$/i, 'memorandum'],
  [/^monies$/i, 'money'],
  [/^mongooses$/i, 'mongoose'],
  [/^mottoes$/i, 'motto'],
  [/^moves$/i, 'move'],
  [/^mythoi$/i, 'mythos'],
  [/^niches$/i, 'niche'],
  [/^nuclei$/i, 'nucleus'],
  [/^numina$/i, 'numen'],
  [/^occiputs$/i, 'occiput'],
  [/^octopuses$/i, 'octopus'],
  [/^opuses$/i, 'opus'],
  [/^oxen$/i, 'ox'],
  [/^passersby$/i, 'passerby'],
  [/^penises$/i, 'penis'],
  [/^people$/i, 'person'],
  [/^plateaux$/i, 'plateau'],
  [/^runners-up$/i, 'runner-up'],
  [/^safes$/i, 'safe'],
  [/^sexes$/i, 'sex'],
  [/^soliloquies$/i, 'soliloquy'],
  [/^sons-in-law$/i, 'son-in-law'],
  [/^syllabi$/i, 'syllabus'],
  [/^testes$/i, 'testis'],
  [/^thieves$/i, 'thief'],
  [/^teeth$/i, 'tooth'],
  [/^tornadoes$/i, 'tornado'],
  [/^trilbys$/i, 'trilby'],
  [/^turfs$/i, 'turf'],
  [/^valves$/i, 'valve'],
  [/^volcanoes$/i, 'volcano'],
  [/^abuses$/i, 'abuse'],
  [/^avalanches$/i, 'avalanche'],
  [/^caches$/i, 'cache'],
  [/^criteria$/i, 'criterion'],
  [/^curves$/i, 'curve'],
  [/^emphases$/i, 'emphasis'],
  [/^foes$/i, 'foe'],
  [/^graves$/i, 'grave'],
  [/^hoaxes$/i, 'hoax'],
  [/^media$/i, 'medium'],
  [/^neuroses$/i, 'neurosis'],
  [/^saves$/i, 'save'],
  [/^waves$/i, 'wave'],
  [/^oases$/i, 'oasis'],
  [/^valves$/i, 'valve'],
  [/^zombies$/i, 'zombie'],
];

const rules: [RegExp, string][] = [
  // from getSingular https://github.com/doctrine/inflector/blob/2.0.x/lib/Doctrine/Inflector/Rules/English/Inflectible.php
  [/(s)tatuses$/, '$1$2tatus'],
  [/(s)tatus$/, '$1$2tatus'],
  [/(c)ampus$/, '$1$2ampus'],
  [/^(.*)(menu)s$/, '$1$2'],
  [/(quiz)zes$/, '$1'],
  [/(matr)ices$/, '$1ix'],
  [/(vert|ind)ices$/, '$1ex'],
  [/^(ox)en/, '$1'],
  [/(alias)(es)*$/, '$1'],
  [/(buffal|her|potat|tomat|volcan)oes$/, '$1o'],
  [
    /(alumn|bacill|cact|foc|fung|nucle|radi|stimul|syllab|termin|viri?)i$/,
    '$1us',
  ],
  [/([ftw]ax)es/, '$1'],
  [/(analys|ax|cris|test|thes)es$/, '$1is'],
  [/(shoe|slave)s$/, '$1'],
  [/(o)es$/, '$1'],
  [/ouses$/, 'ouse'],
  [/([^a])uses$/, '$1us'],
  [/([lm|])ice$/, '$1ouse'],
  [/(x|ch|ss|sh)es$/, '$1'],
  [/(m)ovies$/, '$1$2ovie'],
  [/(s)eries$/, '$1$2eries'],
  [/([^aeiouy]|qu)ies$/, '$1y'],
  [/([lr])ves$/, '$1f'],
  [/(tive)s$/, '$1'],
  [/(hive)s$/, '$1'],
  [/(drive)s$/, '$1'],
  [/(dive)s$/, '$1'],
  [/(olive)s$/, '$1'],
  [/([^fo])ves$/, '$1fe'],
  [/(^analy)ses$/, '$1sis'],
  [/(analy|diagno|^ba|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/, '$1$2sis'],
  [/(tax)a$/, '$1on'],
  [/(c)riteria$/, '$1riterion'],
  [/([it])a$/, '$1um'],
  [/(p)eople$/, '$1$2erson'],
  [/(m)en$/, '$1an'],
  [/(c)hildren$/, '$1$2hild'],
  [/(f)eet$/, '$1oot'],
  [/(n)ews$/, '$1$2ews'],
  [/eaus$/, 'eau'],
  // [], // -> fallback, better use it as last return to allow 100% test coverage
];

const inflector = (value: string) => {
  for (const regexp of uninflected) {
    if (regexp.test(value)) {
      return value;
    }
  }
  for (const [from, to] of irregular) {
    if (from.test(value)) {
      return value.replace(from, to);
    }
  }
  for (const [from, to] of rules) {
    if (from.test(value)) {
      return value.replace(from, to);
    }
  }

  return value.replace(/s$/, '');
};

// see https://github.com/laravel/framework/blob/93a1296bca43c1ca8dcb5df8f97107e819a71499/src/Illuminate/Support/Pluralizer.php

const singular = (value: string) => {
  const singularValue = inflector(value);

  return matchCase(singularValue, value);
};

export default singular;
