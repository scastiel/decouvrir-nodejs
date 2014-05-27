# Chapitre 3 : Un site web bien architecturé avec Express

Lorsque l'on crée un site ou une application web, il est nécessaire que celui
/celle-ci soit bien architecturé(e). C'est justement le but d'un framework. À
l'instar des « gros » frameworks comme Symfony et Ruby On Rails, Express
permet d'organiser votre application web en fonction des requêtes qu'elle est
censée recevoir. Vous l'aurez compris, contrairement aux autres frameworks
cités précédemment, Express reste dans la philosophie de Node.js en étant
léger et très simple à mettre en œuvre.

## 3.1 Installation de Express

Contrairement à _http_ ou _url_ que nous avons utilisés précédemment, Express
(qui se constitue principalement du module _express_) ne fait pas partie de la
distribution de base de Node.js. Pour l'inclure à notre application, il suffit
de suivre la procédure suivante :

* Se rendre en ligne de commande dans le répertoire de notre application (répertoire vierge ou répertoire utilisé pour les exemples précédents) ;
* Utiliser le gestionnaire de paquets de Node.js _npm_ grâce à la commande : `npm install express`

La commande va télécharger le module _express_ ainsi que tous les modules dont
il dépend (et ils sont nombreux). Si tout se passe bien, vous devez remarquer
l'apparition d'un répertoire _node_modules_ dans votre répertoire courant.

Note sur les modules : vous le comprendrez rapidement : la philosophie des
modules de Node est un module = une utilité. Autrement dit, un module
n'accomplit en général qu'une tâche précise. C'est l'utilisation conjointe de
plusieurs modules qui permet de générer des applications (ou modules) plus
complexes.

## 3.2 Une application basique avec Express

Afin d'en découvrir le fonctionnement de base, je vous propose de reprendre
notre application révolutionnaire du chapitre précédent, celle qui demande son
nom à l'utilisateur pour le saluer ensuite.

Voici pour rappel le code principal de l'application telle que nous l'avons
écrit :

```javascript
var url_parts = url.parse(req.url, true);
var name = url_parts.query.name;
if (name) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({message: 'Hello ' +name + '!'}));
} else {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('hello02.html', function (err,data) {
		res.end(data);
	});
}
```

On voit que les différents cas de figure qui peuvent se présenter sont
distingués par un _if_. Ici nous n'en avons que deux, mais si nous devions
traiter dix types de requêtes différents, le programme deviendrait vite
illisible… C'est alors que l'usage d'un _routeur_ va nous simplifier la vie.

Plongeons au cœur du sujet, voici le code de la version de notre programme
utilisant Express :

```javascript
var express =require('express');
var fs = require('fs');
var app = express();

app.get('/',function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('express01.html', function (err,data) {
		res.end(data);
	});
});

app.get('/hello/:name', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({message: 'Hello ' + req.params.name + '!'}));
});

app.listen(8080);
```

À première vue, et même sans connaître le fonctionnement d'Express, le code
semble déjà plus « aéré ».

```javascript
var express = require('express');
var fs = require('fs');
var app = express();
```

On inclut comme d'habitude les modules que l'on va utiliser. Nous avons déjà
vu le module _fs_ permettant de lire un fichier ; le module _express_ s'inclut
de la même manière pour créer la fonction express() qui sert à créer notre
application app. Cette application est l'objet global que nous utiliserons
pour configurer les actions à effectuer en fonction de la requête.

```javascript
app.get('/', function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('express01.html', function (err,data) {
		res.end(data);
	});
});
```

La méthode get de l'objet app nous permet ici de définir le comportement
lorsque c'est l'URL _http://localhost:8080/_ qui est appelée, autrement dit la
racine (/) de notre site. Le contenu de la fonction qu'elle prend en deuxième
paramètre est strictement identique à celui vu au chapitre précédent : on lit
le fichier _express01.html_ et on le renvoie.

```javascript
app.get('/hello/:name', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({message: 'Hello ' + req.params.name + '!'}));
});
```

Le deuxième cas de figure est plus intéressant. On gère ici le cas où l'URL
est de la forme `/hello/:name`. La partie `:name` correspond ici à un paramètre,
c'est à dire à une valeur qui pourra être remplacée par n'importe quoi. Par
exemple, si l'on appelle l'URL _http://localhost:8080/hello/Jean_, c'est cette
fonction qui sera utilisée.

Le plus intéressant avec ce paramètre est évidemment qu'il est possible de
récupérer sa valeur. C'est ce qui est fait lorsque l'on renvoie le contenu en
JSON, via `req.params.name`. C'est tout de même beaucoup plus simple que de
récupérer l'URL, de la décomposer avec le module _url_, et d'adapter le
comportement en fonction de la présence ou non du paramètre `name` !

Bien évidemment, les fonctionnalités proposées par Express vont bien au-delà
de cela, continuons notre exploration avec une fonction dont tout webmaster un
minimum rigoureux a besoin : les templates.

## 3.3 Utiliser des templates

Si vous avez déjà développé un site web, vous connaissez sans doute le
principe des templates. Le but est d'écrire la vue (traditionnellement du
HTML) séparément du code métier. Dans l'idéal, un webdesigner ne connaissant
pas du tout le code métier (qu'il soit JavaScript, PHP, Ruby…) doit être
capable d'écrire le template.

Concrètement, un langage de template se caractérise par deux fonctions
principales :

* la substitution de variables : remplacer par exemple « Bonjour #{name} » par « Bonjour Jean » si la variable `name` vaut « Jean » ;
* l'utilisation de structures conditionnelles et de boucles, dépendant notamment des variables données en paramètre.

Les moteurs de template les plus avancés proposent des fonctions bien plus
évoluées comme l'application de fonctions aux valeurs affichées, de l'héritage
de templates, etc.

Il existe plusieurs moteurs de templates utilisables avec Node.js ; j'ai
choisi de vous présenter _Jade_, d'une part parce qu'Express permet de
l'utiliser très facilement, et d'autre part parce qu'il dispose d'une syntaxe
un peu particulière mais très efficace.

### 3.3.1 Présentation du moteur de template Jade

Le moteur de template Jade permet typiquement de générer une page HTML, mais
sa particularité est que les templates proprement dits ne sont pas écrits en
HTML.

Commençons avec un exemple de template Jade, celui que nous allons utiliser
par la suite. Il s'agit quasiment du même exemple que celui vu précédemment, à
l'exception qu'ici nous allons donner le choix à l'utilisateur entre plusieurs
prénoms. (Révolutionnaire, non ?)

```jade
!!!
html
	head
		title= theTitle
	body
		div Choisir un prénom :
		- for name in theNames  
			label
				input(type="radio",name="name",value=name)
				span Prénom : #{name}
			br
		div
			input(type="button",onclick="valid()",value="OK")
			#message
		script(src="http://code.jquery.com/jquery-1.10.1.min.js")
		script.
			function valid() {
				$.get('/hello/' + $('[name=name]:checked').val(), function(data) {
					$('#message').html(data.message);
				}, 'json');
			}
```

Comme vous pouvez le remarquer, ça a le goût et l'odeur du HTML, mais ça n'en
est pas. Les balises type XML ont disparu au profit d'une organisation à base
d'indentation.

Analysons pas à pas le contenu de ce template.

```jade
!!!
```

La première instruction !!! sert à insérer la déclaration du _doctype_ de
notre page (celui de HTML5 par défaut). Le code généré sera <!DOCTYPE html>.

```jade
html
	head
		title= theTitle
```

Le document débute ensuite avec la déclaration de notre balise `html`, puis de
sa balise `head`. Vous l'avez compris, pour déclarer une balise avec Jade (`html`,
`a`, `p`, etc.), on commence la ligne avec le nom de la balise.

Notre balise `title` a une petite particularité : on a écrit `title=` et non
title. Cela indique à Jade que le contenu de la balise n'est pas le texte qui
suit, mais le contenu de la variable dont le nom est indiqué, ici `theTitle`,
que nous donnerons un peu plus tard à Jade pour qu'il génère le HTML.

Si on avait voulu déclarer un titre statique (ne dépendant pas d'une
variable), on aurait pu écrire : `title Hello!`.

```jade
body
	div Choisir un prénom :
```

Nous attaquons ensuite le corps de la page avec la balise `body`. Son premier
élément est une balise `div`, dont le contenu est « Choisir un prénom ».

```jade
- for name in theNames  
	label
		input(type="radio",name="name",value=name)
		span Prénom : #{name}
	br
```

Nouvelle instruction particulière ensuite, la ligne commence par le symbole `-`
(tiret haut). Cela indique à Jade qu'il s'agit d'une instruction
conditionnelle ou de boucle, ici `for`. Sa syntaxe est relativement similaire à
ce que l'on voit dans d'autres langages : `- for var element in tableau` permet
de parcourir les éléments du tableau en définissant à chaque itération
la variable `element`.

Dans notre exemple le tableau à parcourir est `theNames`, variable que nous
allons fournir à Jade pour la génération, comme pour `theTitle` vue plus haut.

Donc pour chaque élément de `theNames`, nous allons générer une balise `label`,
qui contiendra elle-même deux balises, un bouton-radio et un libellé.

Le bouton radio (en HTML `<input type="radio"...`) possède trois attributs qui
sont définis dans Jade à l'aide de parenthèses. Notez que pour les attributs
`type` et `name` les valeurs sont entre guillemets doubles car elles sont
statiques. En revanche, `value=name` indique que Jade soit substituer `name` par
la valeur de la variable `name`.

Le libellé est déclaré par l'instruction `span Prénom : #{name}`. Si nous avions
voulu que le libellé soit simplement le prénom à choisir, nous aurions écrit
`span= name`. Mais la syntaxe que nous utilisons ici permet d'intégrer le contenu
de la variable au sein de contenu statique. Ici, `#{name}`  sera substitué par
la valeur de la variable `name`.

```jade
script(src="http://code.jquery.com/jquery-1.10.1.min.js")
script.
	function valid() {
		$.get('/hello/' + $('[name=name]:checked').val(), function(data) {
			$('#message').html(data.message);
		}, 'json');
	}
```

Rien de plus à dire ici, si ce n'est l'utilisation de la balise `script.`, avec
le point à la fin. Cette syntaxe, utilisée avec les balises `script` et `style`
permet d'indiquer à Jade qu'il ne faut pas interpréter le contenu de la balise
(le JavaScript et le CSS ne sont en effet pas soumis à l'interprétation de
Jade).

Voilà pour ce qui est de notre petite introduction à Jade. Ses possibilités
vont bien au-delà de ce qui a été présenté, mais cela devrait suffire pour
comprendre la suite, notamment l'utilisation de templates avec Node.js en
général, et plus spécifiquement avec Express. J'espère aussi que cela vous a
donné envie d'aller plus loin dans la découverte de Jade ; la syntaxe est
déroutante, mais dès que les fichiers deviennent conséquents la maintenance
est beaucoup plus aisée que pour du HTML classique.

Voyons maintenant comment utiliser ce template au sein de notre application
Express.

### 3.3.2 Utiliser Jade avec Express

La première chose à faire est d'installer le module Jade, comme nous l'avons
fait avec Express :

```sh
$ npm install jade
```

À présent, le code de notre programme révolutionnaire, qui s'est encore un peu
simplifié :

```javascript
var express =require('express');
var fs = require('fs');
var app = express();

app.set('viewengine', 'jade');
app.set('views', __dirname);

app.get('/',function(req, res) {
	res.render('express02', {title: 'Hello', names: [ 'Pierre', 'Paul', 'Jacques' ] });
});

app.get('/hello/:name', function(req,res){
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({message: 'Hello ' + req.params.name + '!'}));
});

app.listen(8080);
```

Première remarque : il n'est pas nécessaire d'inclure le module _jade_ avec
une instruction `require`. Express s'en charge lorsque nous déclarons le moteur
de template que nous souhaitons utiliser :

```javascript
app.set('view engine', 'jade');
app.set('views', __dirname);
```

La deuxième instruction sert ici à déclarer que nos templates se trouvent dans
le même répertoire que les sources du programme (`__dirname`). Il va de soi que
pour un programme plus conséquent il est judicieux d'avoir un répertoire
(voire une arborescence) dédié aux templates.

La seule différence ensuite, par rapport à la version précédente, est cette
ligne :

```javascript
res.render('express02', { title: 'Hello', names: [ 'Pierre', 'Paul', 'Jacques' ] });
```

Nous indiquons ici à Express qu'il doit :

* utiliser le template _express02_ : pour cela il va chercher le fichier _express02.jade_ dans le répertoire courant comme nous le lui avons indiqué ;
* lui passer en paramètres les données `title` et `names`, la première étant une chaîne et la deuxième un tableau.

Le tout en une ligne ! Si vous lancez le programme et appelez l'URL
_http://localhost:8080/_, vous pourrez observer une page dont le titre est «
Hello » (variable `title`), et contenant trois boutons radio, un pour chaque
prénom que nous avons mis dans la variable `names`.

Maintenant que nous avons découvert les bases d'Express et de Jade, voyons
comment Express peut nous simplifier la tâche dans le cadre d'applications
plus complexes, composées de plusieurs pages.

## 3.4 Une application Express plus complexe

Nous avons vu dans les parties précédentes comment créer une application
minimaliste avec Express. Mais que se passe-t-il lorsque votre application (ou
site) est composée de plusieurs pages par exemple ? Il est alors nécessaire
d'organiser les sources de manière à ce que l'ensemble reste lisible et
maintenable. Pour cela, Express peut nous rendre service en créant
automatiquement une belle arborescence. Cela nous fait gagner du temps, mais
permet surtout de comprendre les bonnes pratiques concernant l'organisation
d'une application constituée de plusieurs scripts, templates, etc.

Pour cela, il est d'abord nécessaire d'installer le module _express_, mais de
manière _globale_, c'est à dire de sorte à rendre ce module utilisable par
n'importe quelle application Node.js sur le système, et non juste pour
l'application du répertoire courant. Cela se fait par la commande :

```sh
npm install -g express
```

En tapant ensuite la commande `express`, vous pourrez vérifier si le module a
bien été installé.

Pour créer ensuite un projet Express, rendez-vous en ligne de commande dans le
répertoire parent qui accueillera votre répertoire projet, puis tapez la
commande :

```sh
express express03
```

(`express03` est ici le nom à donner au projet.) Express a donc créé un
répertoire _express03_, dont l'arborescence contient des sources et plusieurs
répertoires :

* _public/_ : contient les fichiers 'ressources' de l'application web : CSS, JavaScript client, images, etc. ;
* _routes/_ : contient les _routes_, c'est à dire les sous-modules de notre application ;
* _views/_ : contient les vues de notre application, c'est à dire les modèles Jade ;
* _app.js_ : le point d'entrée de l'application ;
* _package.json_ : fichier contenant les méta-données de l'application, les dépendances, etc.

Premier fichier intéressant, le fichier _package.json_.

```json
{
	"name": "application-name",
	"version": "0.0.1",
	"private": true,
	"scripts": {
		"start": "node app.js"
	},
	"dependencies": {
		"express": "3.4.0",
		"jade": "*"
	}
}
```

Il permet d'y placer les métadonnées concernant notre application : le nom,
l'auteur, la version, etc. Cela peut être très utile si vous décidez de
distribuer votre application. Mais ces données ne servent pas « qu'à faire
joli » : le bloc `dependencies` permet d'indiquer les dépendances de votre
application, autrement dit les modules requis pour la faire fonctionner. Ici,
nous avons besoin du module _express_ en version 3.4.0, et du module _jade_,
dans la dernière version disponible.

Afin d'installer automatiquement les dépendances de l'application en se basant
sur les informations du _package.json_, tapez la commande :

```sh
$ npm install
```

Nous reviendrons en détail sur les possibilités offertes par ce fichier dans
le chapitre 5.

Analysons à présent le contenu du fichier principal : _app.js_.

```javascript
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
```

J'ai volontairement retiré quelques lignes du fichier afin de faciliter
l'explication. Globalement peu de nouveautés dans ce fichier. On initialise un
objet application (`app`) dont on configure le port à écouter
(`app.set('port',...)`), le moteur de template (Jade) ainsi que le répertoire où
ces templates sont stockés (le sous-répertoire _views_), et enfin le
répertoire des ressources « statiques » (le sous-répertoire _public_).

Les trois dernières lignes sont une méthode un peu différente de lancer le
serveur par rapport à ce que nous avions vu, mais cela revient globalement au
même.

La nouveauté réside ici dans les lignes suivantes :

```javascript
var routes = require('./routes');
var user = require('./routes/user');

app.get('/',routes.index);
app.get('/users',user.list);
```

En réalité, nous ne faisons qu'appeler la fonction `get` comme nous le faisions
déjà, mais plutôt que de lui donner la fonction directement lors de l'appel,
nous lui donnons une référence vers la fonction déclarée ailleurs. Les
fonctions `routes.index` et `user.list` sont définies respectivement dans les
fichiers _routes/index.js_ et _routes/user.js_.

La syntaxe permettant d'inclure des fichiers comme cela est fait ici sera
détaillée dans le chapitre 5 consacré à la création de modules. Le contenu des
fichiers inclus est très simple :

```javascript
// routes/index.js
exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

// routes/user.js
exports.list = function(req, res){
	res.send("respond with a resource");
};
```

Dans le premier cas, nous appelons le modèle _index_ (situé dans
_views/index.jade), et dans le deuxième nous renvoyons un message texte.

La nouveauté dans cette application réside dans le modèle _index.jade_ :

```jade
extends layout

block content
	h1= title
	p Welcome to #{title}
```

Pas de structure HTML classique ici, seulement deux instructions principales :

* `extends layout` : on déclare que notre modèle index hérite en quelques sortes du modèle `layout`. Autrement dit, la page sera basée sur le modèle layout ;
* `block content` : partant du template _layout_, on remplira le bloc content par le contenu inscrit ici (un titre `h1` et une ligne de texte `p`).

Si l'on observe le template _layout_, on remarque la présence du bloc _content_
(`block content`) : c'est lui qui sera rempli avec le code contenu dans
_index.jade_ :

```jade
doctype 5
html
	head
		title= title
		link(rel='stylesheet',href='/stylesheets/style.css')
	body
		block content
```

Nous aurions pu regrouper le tout dans un seul fichier sans faire appel aux
_blocks_ de Jade en plaçant le `h1` et le `p` directement dans la balise body ;
l'intérêt est que lorsqu'on a plusieurs pages, on peut utiliser le même
_layout_, c'est à dire la même architecture, le même design, le même en-tête,
etc. de page.

## 3.5 Exercice

Afin de mettre en pratique ce que nous venons de voir, je vous propose
l'exercice suivant :

* reprendre l'exemple que nous venons de voir ;
* ajouter une page accessible à l'adresse _/hello_, et ayant en commun avec la page d'accueil une barre de menu contenant deux liens : un vers la page d'accueil et un vers la nouvelle page ;
* sur la nouvelle page, ajouter le formulaire que nous avons vu au début du chapitre demandant son nom à l'utilisateur ;
* au clic sur le bouton _OK_ du formulaire, l'application effectuera un appel AJAX à l'URL _/hello/sayHello/?name=LePrenomSaisi_ qui renverra au format JSON un message de salutation, qui sera affiché sur la page.

## 3.6 En résumé

Nous avons vu dans ce chapitre comment créer une application web bien
structurée. Encore une fois, l'objectif d'Express (et de Node en général)
n'est pas de concurrencer des frameworks comme Symfony ou Ruby on Rails, qui
seront beaucoup plus adaptés pour créer des applications complexes.

Express se montrera en revanche parfaitement adapté pour créer une application
proposant des webservices REST, ou encore un petit site vitrine disposant de
quelques fonctionnalités dynamiques (formulaire de contact, catalogue de
produits, etc.).

L'un des avantages d'Express est qu'il permet de s'adapter à plusieurs modules
de gestion de templates, mais aussi à des modules de test unitaire ou test
web, d'accès à des bases de données, etc. Et il faut bien le reconnaître, sa
mise en place est tout de même beaucoup plus facile que celle de Symfony !
