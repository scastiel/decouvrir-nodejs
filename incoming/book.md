# Chapitre 5 : Créez et diffusez vos modules

Nous l'avons vu, l'une des forces de Node.js est la possibilité qu'il donne
d'étendre ses fonctionnalités au moyen de modules. Nous avons vu des modules
intégrés à la distribution par défaut de Node.js _(http, url,fs)_, des modules
tiers récupérés via le gestionnaire de paquets _npm_ _(express, mongoose…)_,
mais vous vous doutez bien qu'il est possible de créer vos propres modules.

Il y a typiquement deux raisons qui peuvent vous pousser à créer vos propres
modules :

  * structurer une application qui devient complexe : modulariser votre code le rend plus facile à maintenir ou à débuguer ;
  * rendre des parties de votre code réutilisables au sein d'un autre projet ou par la communauté.

Pour ce chapitre, nous allons développer un module très simple qui utilise
l'API de _geocoding_ de Google, documentée à l'adresse
https://developers.google.com/maps/documentation/geocoding/?hl=fr. Le principe
de cette API est le suivant : on lui donne une adresse (par exemple « Place de
Bretagne, Rennes »), et elle nous renvoie diverses informations sur cette
adresse, et notamment ses coordonnées (latitude et longitude).

## 5.1 Spécifications de notre module

Notre module, que j'ai choisi d'appeler sobrement _google-geocoding_,
disposera d'une seule méthode : geocode. Celle-ci prendra deux paramètres :

  * l'adresse dont on souhaite avoir les coordonnées ;
  * la fonction à appeler une fois l'appel effectué, elle-même prenant deux paramètres :
  * l'erreur éventuelle en cas de problème d'appel à l'API (null sinon) ;
  * le résultat du geocoding sous forme d'objet { lat: 48.1091828,lng : -1.6839106 }, ou null si Google n'a pas trouvé notre adresse.

Voici un exemple d'utilisation de notre futur module :

var google_geocoding = require('./google-geocoding');


google_geocoding.geocode('Place de Bretagne, Rennes',function(err, location) {

if( err ) {

console.log('Erreur : ' + err);

} else if( !location ) {

console.log('Aucun résultat.');

} else {

console.log('Latitude : ' + location.lat + ' ; Longitude : ' + location.lng);

}

});

Si vous exécutez ce code, vous obtiendrez naturellement une erreur : notre
module n'existe pas encore. Notez que l'instruction require fait appel au
module par ./google-geocoding car le module se situera dans le fichier google-
geocoding.js situé dans le même répertoire.

Créons ce fichier avec le contenu suivant :

module.exports.geocode = function(address, callback) {

callback('Not implemented', null);

};

Il ne fait rien pour l'instant, mais cela va nous permettre de l'utiliser sans
avoir d'exception déclenchée par Node.

## 5.2 Testons notre module avec Mocha

Et là vous cherchez si vous n'avez pas oublié de lire un chapitre. Et bien non
: nous allons bien tester notre module _google-geocoding_ avant même de
l'écrire. En réalité, nous n'allons qu'écrire les tests unitaires, autrement
dit nous allons appliquer la méthode bien connue et très en vogue de
développement des _TDD_, pour _test-driven development_. Le principe est
simple : écrire les tests en fonction des spécifications et non du code testé.
Idéalement, ces tests sont mêmes écrits par un autre développeur que celui
écrivant le code testé.

Entrons dans le vif du sujet : _Mocha_. Il s'agit d'un module (qui s'installe
avec npm install -g mocha) permettant de réaliser très simplement des tests
unitaires sur du code JavaScript, et plus particulièrement avec Node.js. En
complément de Mocha, nous utiliserons également le module _Should_ (npm
install should) facilitant l'écriture des tests unitaires.

Une fois le module Mocha installé, la commande mocha peut être exécutée en
ligne de commande afin de lancer les tests. Par défaut, Mocha va chercher les
tests dans le fichier _tests/test.js_. Créons donc ce fichier, avec le contenu
suivant :

var should = require('should');

vargoogle_geocoding = require('../google-geocoding');


describe('Google geocoding', function(){

describe('#geocode()', function(){


it('should return null on incorrect address', function(done){

google_geocoding.geocode('tototititutu', function(err, location) {

should.not.exist(err);

should.not.exist(location);

done();

});

});


it('should return non null on correct address', function(done){

google_geocoding.geocode('Place de Bretagne, Rennes', function(err, location)
{

should.not.exist(err);

location.should.have.property('lat');

location.should.have.property('lng');

done();

});

});


});

});

Mocha permet d'écrire les tests avec une syntaxe très intuitive (tout en
restant du vrai code JavaScript) au moyen de fonctions comme describe ouit.
Ces deux fonctions ne servent qu'à organiser les tests. Ici comme nous n'avons
qu'une seule méthode à tester, l'organisation reste relativement simple.

Nous déclarons ici deux cas de test : un pour une adresse incorrecte (auquel
cas notre méthode geocode ne renvoie pas d'erreur et un résultat null), et un
pour une adresse correcte.

Le module _should_ nous permet d'écrire des _assertions_, comme « location
doit avoir une propriété_lat_ ». Cela s'écrit :
location.should.have.property('lat');. Facile non ?

Pour déclarer qu'un objet (ici err) doit être nul, on utilisera
should.not.exist(err). On ne peut pas utiliser la syntaxe
err.should.not.exist, car par définition si err est nul, alors il ne peut pas
disposer de la propriété should.

À présent lançons nos tests ! Dans le répertoire du module, tapez la commande
mocha -R spec et observez le résultat : (l'option -R spec ne sert qu'à avoir
un affichage plus détaillé.)

$ mocha -R spec


Google geocoding

#geocode()

1) should return null on incorrect address

2) should return non null on correct address


0 passing (8ms)

2 failing

(...)

Sans surprise, les tests ne passent pas. Notez tout de même que l'affichage
généré par Mocha rend le résultat facilement compréhensible, avec le détail et
la trace de chaque erreur (que je n'ai pas reproduits ici).

Maintenant que notre module est testable, il est temps d'en écrire le contenu.

## 5.3 Le module de geocoding

Voici le code de notre module, à placer dans notre fichier _google-
geocoding.js_ :

var http = require("http");


module.exports.geocode = function(address, callback) {


varurl = "http://maps.googleapis.com/maps/api/geocode/json?address="
+encodeURIComponent(address) + "&sensor=false";


http.get(url, function(res) {

if( res.statusCode != 200 ) {

callback("Statut HTTP = " + res.statusCode, null);

} else {

var output = '';

res.setEncoding('utf8');

res.on('data', function (chunk) {

output += chunk;

});


res.on('end', function() {

var response =JSON.parse(output);

if(response.status == "OK" ) {

var location =response.results[0].geometry.location;

callback(null, location);

} else if(response.status == "ZERO_RESULTS" ) {

callback(null, null);

} else {

callback("Status = " +response.status, null);

}

});

}

}).on('error', function(e) {

callback(e.message, null);

});


};

Rien de vraiment nouveau ici par rapport à ce que nous avons vu. Notez
l'utilisation de la méthode get du module _http_, qui permet non pas de créer
un serveur mais de lancer une requête HTTP _GET_ sur un serveur, ici le
serveur de l'API Google. La particularité ici est que l'on lit le retour de
cet appel par morceaux _(chunks)_,grace à res.on('data',...) et
res.on('end',...).

Pour déclarer une méthode _publique_ du module, on utilise l'objet module, et
sa propriété exports. Ainsi nous pourrions créer un module ainsi :

var f =function() { ... };

var g =function() { ... f(); ... }

module.exports = {

super_methode: function() { ... g(); ... }

};

La fonction g utilise la fonction f, et nous rendons une méthode publique,
super_methode qui fait appel à g. Mais si nous utilisons notre module, nous ne
pourrons utiliser ni f  ni g, car celles-ci n'ont pas été exportées.

À présent, si nous exécutons à nouveau notre petit script d'exemple, nous
obtenons l'affichage suivant :

$ node app.js

Latitude : 48.1091828 ; Longitude : -1.6839106

Et si nous lançons notre test avec _mocha_ :

D:\Documents\nodejs\google_geocoding>mocha -R spec


Google geocoding

#geocode()

V should return null on incorrect address (118ms)

V should return non null on correct address (119ms)


2 passing (251ms)

Miracle, notre module vient de passer les tests unitaires avec succès !

## 5.4 Diffusons notre module

Maintenant que nous sommes fiers de notre module, nous pouvons le diffuser
afin qu'il soit utilisable par d'autres personnes, en utilisant le
gestionnaire de paquets _npm_.

Pour cela, il est nécessaire d'effectuer quelques modifications. Tout d'abord,
nous allons créer le fichier qui décrit notre module, le fichier package.json.
Celui-ci contient les informations de base (nom, auteur…), mais aussi les
modules requis par son installation.

Voici un exemple de _package.json_ pour notre module :

{

"author": "Votre nom <votre.email@example.com>",

"name": "google-geocoding",

"description": "Small Node module to use Google Geocoding API.",

"version": "0.1.1",

"repository": {

"url": ""

},

"keywords": [

"google",

"geocoding",

"latitude",

"longitude",

"coordinates"

],

"main": "",

"dependencies": {},

"devDependencies": {

"mocha": "*"

},

"optionalDependencies": {},

"engines": {

"node": "*"

},

"scripts": {

"test": "mocha -R spec"

}

}

De nombreuses options sont disponibles pour ce fichier ; je vous encourage à
aller faire un tour du côté de la documentation
(https://npmjs.org/doc/json.html) pour voir toutes les possibilités.

Nous avons également besoin d'un fichier _README_ ; même si cela n'est pas
forcément requis, cela est fortement conseillé pour les utilisateurs qui
souhaiteraient utiliser notre module. Il décrit typiquement au moins la
procédure d'installation, et un exemple d'utilisation.

google-geocoding

=====================


This module allows you to use [Google geocoding
API](https://developers.google.com/maps/documentation/geocoding/) to get the
coordinates of a specific location.


Installation

------------  

npm install google-geocoding


Example

-------  

```javascript

vargoogle_geocoding = require('google-geocoding');


google_geocoding.geocode('Place de Bretagne, Rennes, France', function(err,
location) {

if( err ) {

console.log('Error: ' + err);

} else if( !location ) {

console.log('No result.');

} else {

console.log('Latitude: ' +location.lat + ' ; Longitude: ' +location.lng);

}

});

```

Le plus simple pour le _README_ est d'utiliser le format Markdown
(http://fr.wikipedia.org/wiki/Markdown), très en vogue actuellement et
s'affichant très bien sur _npmjs.org_ où notre module sera disponible.
Appelons donc le fichier _README.md_.

Par ailleurs, modifions le fichier de test _test/test.js_ afin que le la ligne
require de notre module devienne :

var google_geocoding = require('google-geocoding');

Je reviendrais un peu plus bas sur l'intérêt de cette modification.

La dernière manipulation à effectuer consiste à nettoyer un peu le contenu du
répertoire du module. Commencez par supprimer (ou déplacer ailleurs) les
fichiers autres que _google-geocoding.js_ et _test/test.js_ (et évidemment les
fichiers _README.md_ et _package.json_ que nous venons de créer). Puis
renommez le fichier _google-geocoding.js_ en _index.js_ ; ainsi il sera
considéré comme le fichier _par défaut_ du module, c'est lui qui sera appelé
lorsque l'on écrira require('google-geocoding').

Nous obtenons donc l'arborescence suivante :

  * test
    * test.js
  * README.md
  * package.json
  * index.js

Notre module est maintenant prêt à être diffusé. Tout d'abord, il est
nécessaire de se créer un compte sur les dépôts de _npm_. Cela se fait à
l'adresse http://npmjs.org/.

Deux commandes suffisent ensuite à rendre notre module public :

$ npm adduser

Username: <saisir votre login npmjs.org>

Password: <saisir votre mot de passe>

Email: <saisir votre e-mail>

npm http PUT https://registry.npmjs.org/-/user/org.couchdb.user:votrelogin

npm http 201 https://registry.npmjs.org/-/user/org.couchdb.user:votrelogin


$ npm publish

npm http PUT https://registry.npmjs.org/google-geocoding

npm http 201 https://registry.npmjs.org/google-geocoding

npm http GET https://registry.npmjs.org/google-geocoding

npm http 200 https://registry.npmjs.org/google-geocoding

npm http PUT https://registry.npmjs.org/google-geocoding/-/google-
geocoding-0.1.1.tgz/-rev/1-08931f6eef42fb88dc95f6dfc8f30b81

npm http 201 https://registry.npmjs.org/google-geocoding/-/google-
geocoding-0.1.1.tgz/-rev/1-08931f6eef42fb88dc95f6dfc8f30b81

npm http PUT https://registry.npmjs.org/google-geocoding/0.1.1/-tag/latest

npm http 201 https://registry.npmjs.org/google-geocoding/0.1.1/-tag/latest

+ google-geocoding@0.1.1

Et voilà, le module est diffusé. Vous pourrez constater sa présence en vous
rendant sur la page de votre compte sur http://npmjs.org (quelques minutes
sont parfois nécessaires pour le voir apparaître).

Pour tester l'installation, il nous suffit de reprendre le script d'exemple vu
précédemment, en pensant à utiliser require('google-geocoding') et non require
('./google-geocoding') :

vargoogle_geocoding =require('google-geocoding');


google_geocoding.geocode('Place de Bretagne, Rennes',function(err, location) {

if(err ) {

console.log('Erreur : ' +err);

} else if( !location ) {

console.log('Aucun résultat.');

} else {

console.log('Latitude : ' +location.lat + ' ; Longitude : ' +location.lng);

}

});

Penser à installer le module _google-geocoding_ avant de lancer le programme :

$ npm install google-geocoding

npm http GET https://registry.npmjs.org/google-geocoding

npm http 200 https://registry.npmjs.org/google-geocoding

google-geocoding@0.1.1node_modules\google-geocoding


$ node test-geocoding.js

Latitude : 48.1091828 ; Longitude : -1.6839106

Il nous reste une dernière chose à tester. Nous avions créé un petit script
permettant de tester unitairement notre module. Et bien _npm_ peut lancer les
tests pour nous. En effet nous avons indiqué dans le _package.json_ :

"scripts": {

"test": "mocha -R spec"

}

Cette option indique à_npm_ qu'il peut lancer les tests en exécutant la
commande mocha. À présent, si nous lançons la commande npm test google-
geocoding, _npm_ va exécuter la commande mocha sur notre module fraîchement
installé.

$ npm test google-geocoding


> google-geocoding@0.1.1 test D:\Documents\nodejs\node_modules\google-
geocoding

> mocha -R spec


Google geocoding

#geocode()

V should return null on incorrect address (188ms)

V should return non null on correct address (133ms)


2 passing (332ms)

## 5.5 Conclusion sur les modules

Les modules sont incontestablement l'une des plus grandes forces de NodeJS. De
la même manière que le monde du logiciel libre, Node a progressé grâce à tout
l'écosystème qui lui gravite autour, grâce à la simplicité pour créer des
modules supplémentaires et les diffuser.

Avant de vous lancer dans le développement d'un nouveau module, cherchez s'il
n'en existe pas déjà un qui accomplit ce que vous souhaitez. Peut-être en
trouverez-vous un qui s'en approche, et s'il est sous licence libre, il pourra
être très intéressant et très formateur de le faire évoluer à votre
convenance. _npmjs.org_ et _GitHub_ (http://github.com) sont parfaitement
adaptés pour ça !

#  Aller plus loin

JavaScript est un langage en pleine expansion, comme il l'a été aux débuts du
Web, ainsi que lors de l'apparition du Web 2.0 avec les technologies AJAX.
Aujourd'hui cette expansion est d'autant plus intéressante qu'elle ne se
limite plus à la dynamisation des sites et applications web.

Grâce à Node.js, il devient un langage de plus en plus polyvalent qui permet
désormais de créer des applications serveur ou des programmes autonomes, voire
même des applications mobiles grâce à l'envolée du HTML5.

Node.js n'est pas le seul acteur de ce succès. AngularJS par exemple devient
de plus en plus répandu pour la création d'interfaces clientes riches, en
intégrant une logique modèle-vue-contrôleur côté client. Imaginez ce que peut
donner une application web dont la partie cliente est basée surAngularJS et la
partie serveur sur Node.js avec Express !

Mais JavaScript reste un langage dont la syntaxe peut donner des programmes
difficilement compréhensibles et maintenables (des tableaux de fonctions
renvoyant des fonctions qui renvoient des objets...). Il existe des langages
destinés à faciliter la compréhension du code.

_CoffeeScript_ (http://coffeescript.org) est certainement le plus populaire
actuellement. A partir d'un code dont la syntaxe s'inspire du Python et du
Ruby, c'est du JavaScript qui est généré après une phase de compilation.

Prenons par exemple le code suivant disponible dans la documentation
officielle de CoffeeScript : http://coffeescript.org/#conditionals :

mood = greatlyImproved if singing


if happy and knowsIt

clapsHands()

chaChaCha()

else

showIt()


date = if friday then sue else jill

Après compilation, voici le JavaScript généré :

var date, mood;


if (singing) {

mood = greatlyImproved;

}


if (happy && knowsIt) {

clapsHands();

chaChaCha();

} else {

showIt();

}


date = friday ? sue : jill;

C'est lorsque l'on commence à utiliser des classes et des objets
queCoffeeScript révèle tout son potentiel. En effet la programmation objet
n'existe pas en JavaScript, bien que des techniques permettent de faire tout
comme, mais au prix d'un code encore plus difficilement compréhensible.
CoffeeScript peut alorsrendre les choses beaucoup plus faciles !

C'est ainsi que s'achève notre exploration de Node.js. J'espère que vous aurez
pris autant de plaisir à lire ce livre que j'en ai eu à l'écrire. J'espère
aussi vous avoir donné envie d'en savoir plus sur Node.js et JavaScript en
général. Nul doute que JavaScript a encore de beaux jours devant lui !
