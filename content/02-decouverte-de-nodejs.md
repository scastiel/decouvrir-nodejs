# Chapitre 2 : Découverte de Node.js

## 2.1 Présentation

Depuis sa création, JavaScript a naturellement été associé aux sites et
applications web, domaine pour lequel il a été créé. Il a permis de rendre les
pages web plus dynamiques, en commençant par des animations très _flashy_ dans
les années 1990/2000 (ce que l'on appelait le DHTML), pour en arriver vers les
applications les plus complexes que nous connaissons tous aujourd'hui et qui
se substituent aux applications de bureau : webmail avec Gmail, cartographie
avec Google Maps, etc.

Mais si JavaScript a été créé plus spécialement pour être exécuté dans un
navigateur, il a été standardisé et permet théoriquement d'être utilisé pour
tout type d'application, et notamment des programmes autonomes, c'est-à-dire
ne nécessitant pas de navigateur web pour s'exécuter. C'est sur cet usage que
se base Node.js.

Node.js se constitue d'un programme (appelé _node_) permettant d'interpréter
du code JavaScript, traditionnellement en ligne de commande. Il est également
accompagné d'outils supplémentaires, dont le plus intéressant s'appelle _npm_,
pour _Node package manager_. Il s'agit d'un gestionnaire de paquet à l'image
de _yum_ ou _apt_ (pour les distributions Linux RedHat et Debian/Ubuntu
respectivement), sauf que lui permet de récupérer proprement des outils tiers
utilisables avec Node.js.

Note : dans la suite du livre, pour faire référence à Node.js, je pourrais
également parler simplement de _Node_.

## 2.2 Installation

Node est un outil multiplateforme. Il est possible très facilement de
l'utiliser sous Linux, Windows, OS X, etc. Son installation est on
ne peut plus simple :

  * sous Windows, rendez-vous sur le site officiel de Node (http://nodejs.org) qui à ce jour propose en page d'accueil un lien permettant de télécharger l'installeur ;
  * sous Linux ou MacOS, votre gestionnaire de paquets favori permet généralement de trouver le programme _node_ ou _nodejs_ sans problème.

Pour vérifier que l'installation a bien été effectuée, lancez dans un terminal la commande suivante :

```shell
$ node --version
```

Le résultat doit être la version de Node.js installée (v0.10.18 au moment de
l'écriture de ce livre).

À présent que tout est en place, passons à l'écriture de notre premier script
Node.js !

## 2.3 Hello World!

Pour notre premier script, nous allons créer un petit serveur web. Là vous
devez vous dire que c'est ambitieux comme premier exercice, mais c'est parce
que vous ne connaissez pas encore Node.js !

### 2.3.1 Le code du programme

J'ai volontairement choisi de reprendre le programme d'exemple disponible en
page d'accueil du site officiel de Node, car celui-ci montre de manière très
efficace l'une des principales qualités de Node : sa concision.

Voici le code du programme :

```javascript
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
```

Et c'est tout ! Avant d'expliquer le contenu du script, je vous propose de
l'exécuter pour découvrir la magie. Pour cela créez un fichier appelé par
exemple _hello.js_ dans lequel vous placez le code ci-dessus. Puis ouvrez la
ligne de commande, placez-vous dans le répertoire du script, et tapez la
commande `node hello.js` ; l'affichage devrait être le suivant :

```shell
$ node hello.js
Server running at http://127.0.0.1:1337/
```

Le programme est en attente, c'est normal c'est notre serveur qui tourne. À
présent ouvrez votre navigateur web et rendez-vous à l'URL
_http://127.0.0.1:1337_ ; le texte « Hello World » s'affiche.

Donc si on résume, vous venez de créer un serveur web en 6 lignes de code !
(Et encore, l'une d'elles ne sert qu'à afficher un message « Server running…
»)

### 2.3.2 Explication détaillée

Passons à l'explication de ce programme, ligne par ligne (ou presque).

```javascript
var http = require('http');
```

Comme je l'ai dit, Node.js permet d'utiliser des outils tiers appelés modules.
Il inclut de nombreux modules de base, parmi eux le module _http_ permettant
de créer un serveur web. Par la fonction require, nous demandons à Node.js
d'inclure le module _http_, et nous décidons d'accéder à ses méthodes via un
objet `http`. (Nous aurions pu écrire `var toto = require('http');
toto.createServer(…)` mais cela aurait été moins parlant…)

```javascript
http.createServer(function(req,res) { ... }).listen(1337, '127.0.0.1');
```

La méthode `createServer` de l'objet `http` permet comme son nom l'indique de
créer un serveur, en l'occurrence un serveur web (HTTP). Nous reviendrons sur
la fonction qu'elle prend en paramètres dans quelques instants.

Elle renvoie un objet « serveur », qui est ici masqué en appelant directement
se méthode `listen`. On aurait pu écrire :

```javascript
var server = http.createServer(function(req,res) { ... });
server.listen(1337, '127.0.0.1');
```

La méthode `listen` du serveur permet de lancer l'écoute, ici sur le port 1337
de l'hôte 127.0.0.1 _(localhost)_. Autrement dit, c'est grâce à cette méthode
qu'on lance notre serveur.

```javascript
function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}
```

La fonction qui est passée en paramètre à _createServer_ est celle qui sera
appelée à chaque requête sur notre serveur. Elle prend elle-même deux
paramètres : la requête (`req`) et la réponse (`res`). (Nous aurions pu appeler
les paramètres autrement évidemment, le principal étant qu'ils soient là, et
qu'ils soient deux.)

  * La _requête_ est un objet permettant d'accéder aux détails sur la requête envoyée au serveur : en-têtes HTTP, paramètres GET ou POST, etc. Nous ne l'utilisons pas ici.
  * La _réponse_ est l'objet qui nous permet d'envoyer une réponse à la requête. Dans notre cas, nous effectuons deux actions sur cette réponse :
    * Nous définissons l'en-tête HTTP _Content-type_ à _text__/plain_, ce qui permet d'indiquer que le contenu que nous renvoyons est de type texte. Il pourrait être _text/html_, _application/json_, bref ce que l'on veut tant qu'il s'agit d'un type MIME standard ;
    * Nous terminons la requête en envoyant le texte _Hello World_ (suivi d'un retour à la ligne, qui n'est pas indispensable ici).

Note sur les fonctions callbacks : il est très fréquent de voir avec Node.js
des fonctions qui prennent d'autres fonctions en paramètres. Le principe est
généralement de passer en paramètre à une fonction, une seconde fonction à
exécuter lorsque la première est terminée. Cette seconde fonction est
généralement désignée par le terme de _callback_. Par exemple :

```javascript
var f1 = function(callback) {
    console.log("Première fonction...");
    callback("test");
};
var f2 = function(resultat) {
    console.log("Résultat : " +resultat);
}

f1(f2);
// Sortie :
// Première fonction...
// Résultat : test
```

Dans la dernière ligne, la fonction `console.log` permet d'afficher un message
dans la console (la sortie de la ligne de commande), ce qui nous sert ici à
indiquer que le serveur a bien démarré :

```javascript
console.log('Server running at http://127.0.0.1:1337/');
```

### 2.3.3 En résumé

Pour créer notre serveur web, nous avons :

  * inclut le module _http_ avec la fonction `require` ;
  * créé un serveur HTTP avec la méthode `createServer`, en lui fournissant une fonction plaçant le texte _Hello World_ dans la réponse renvoyée à chaque requête ;
  * mis le serveur en écoute sur le port 1337 ;
  * indiqué dans la console que le serveur était lancé.

Magique non ? Pour terminer ce chapitre consacré aux bases de Node.js,
étudions un exemple légèrement plus complexe…

## 2.4 Un exemple plus complexe...

Dans cette partie nous allons raffiner le petit serveur web créé précédemment
en ajoutant quelques fonctionnalités. Nous allons imaginer une application
très simple, demandant à l'utilisateur son prénom, pour le saluer
personnellement ensuite. Il ne s'agit pas ici de vendre ce concept
révolutionnaire aux grands noms du web, mais d'illustrer plusieurs
fonctionnalités offertes par Node.js :

  * Récupérer et utiliser les paramètres GET passés à la requête ;
  * Lire un fichier HTML local et le renvoyer au navigateur ;
  * Renvoyer du contenu structuré en JSON.

Notre application se constituera d'un formulaire contenant un champ invitant
l'utilisateur à saisir son nom. Un clic sur le bouton OK lancera un appel
AJAX, qui recevra en réponse un message adapté au nom de l'utilisateur. Le
message sera affiché sur la page.

### 2.4.1 Une page HTML

Tout d'abord, nous aurons besoin d'un fichier HTML classique contenant un
formulaire, permettant à l'utilisateur de saisir son nom : (appelons le
_hello02.html_, nous l'utiliserons ensuite).

```html
<input type="text" placeholder="Enter your name" id="name"/>
<input type="button" value="OK" onclick="valid()"/>
<div id="message"></div>
<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script>
function valid() {
    $.get('', { name: $('#name').val() }, function(data) {
        $('#message').html(data.message);
    }, 'json');
}
</script>
```

Passons sur la validité HTML de ce code, seul le nécessaire s'y trouve. Tout
d'abord un champ texte `name`, puis un bouton _OK_ qui lorsque l'on clique
dessus appelle la fonction `valid()` définie ensuite. On utilise _jQuery_ pour
réaliser un appel AJAX. Le script passé en premier paramètre à `$.get` est vide,
ce qui indique au navigateur d'appeler la page sur laquelle on se trouve.

Si vous ouvrez la page dans votre navigateur et que vous remplissez le champ
et cliquez sur le bouton, vous pourrez à l'aide d'un outil comme Firebug ou
les outils de développement Chrome visualiser la requête qui est envoyée via
Ajax : _file:///.../hello02.html?name=Paul_.

Pas de Node.js ici, mais ne vous inquiétez pas, ça arrive !

### 2.4.2 Le script Node.js

Le script Node de notre application a deux utilités :

  * afficher notre fichier HTML lorsqu'aucun paramètre ne lui est passé ;
  * répondre à l'appel AJAX par une réponse JSON.

Voici le code source du script :

```javascript
var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    var url_parts = url.parse(req.url, true);
    var name = url_parts.query.name;
    if (name) {
        console.log('Name: ' +name);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Hello ' +name + '!'}));
    } else {
        console.log('No name!');
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile('hello02.html',function (err,data) {
            res.end(data);
        });
    }
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
```

De la même manière que pour l'exemple précédent, analysons en détail le
contenu de ce script.

```javascript
var http = require('http');
var url = require('url');
var fs = require('fs');
```

Nous avions déjà vu le module _http_, nous utilisons ici en plus les modules
_url_ et _fs_ (également inclus avec Node), permettant respectivement
d'analyser une URL avec ses paramètres, et de lire un fichier sur le serveur
local. Nous allons voir un peu plus bas l'utilisation de ces deux modules.

```javascript
var url_parts = url.parse(req.url, true);
var name = url_parts.query.name;
if (name) {
    ...
} else {
    ...
}
```

La première chose que nous faisons dans la fonction donnée à `createServer` est
de récupérer l'URL appelée, et de la décomposer grâce à la méthode `parse` du
module _url_. Nous récupérons un objet dont la propriété `query` contient ici
les paramètres GET. Celui qui nous intéresse est ici le paramètre `name`.

Autrement dit, si dans notre navigateur nous appelons l'URL
_http://127.0.0.1:1337/?name=Jacques_, notre variable name contiendra la
chaîne « Jacques ».

En fonction de la présence ou non de ce paramètre, nous allons adopter deux
comportements différents.

```javascript
console.log('No name!');
res.writeHead(200, {'Content-Type': 'text/html'});
fs.readFile('hello02.html', function (err,data) {
    res.end(data);
});
```

Dans le cas où aucun nom n'est fourni (on appelle l'URL sans paramètre), on
commence par afficher le message « No name! » dans la console. Puis on définit
le contenu de la réponse HTTP comme de type « text/html », c'est à dire une
page HTML classique.

Puis on fait appel à la méthode `readFile` du module _fs_ qui nous permet de
lire un fichier local, ici _hello02.html_, le fichier que nous avons créé
précédemment et contenant le formulaire. On peut voir que le deuxième
paramètre de cette méthode est une fonction, appelée lorsque le fichier a été
lu. Son contenu y est passé dans le paramètre `data`.

Dit simplement : s'il n'y a pas de nom fourni, on renvoie le contenu du
fichier _hello02.html_.

```javascript
console.log('Name: ' + name);
res.writeHead(200, {'Content-Type': 'application/json'});
res.end(JSON.stringify({message: 'Hello ' + name + '!'}));
```

Dans le cas où un nom est fourni, on ne renvoie plus le formulaire HTML, mais
une réponse structurée, codée en JSON. On définit donc le _Content-type_ à
_application/json_, puis on renvoie notre objet `{ message: 'Hello Jean' }` que
l'on code en JSON via la méthode `JSON.stringify` (fournie par Node.js).

### 2.4.3 En résumé

Dans ce deuxième exemple, nous avons vu :

  * comment utiliser le module _url_ pour analyser une URL et récupérer un paramètre GET ;
  * comment lire un fichier HTML et le renvoyer en réponse afin d'afficher notre formulaire ;
  * comment renvoyer une réponse structurée (en JSON) afin que celle-ci soit analysée lors d'un appel AJAX.

J'espère vous avoir convaincu avec ces deux exemples de la simplicité et de la
concision de Node.js. Dans la suite du livre je vous présenterai des
fonctionnalités plus avancées offertes par Node.js. Et dans le chapitre
suivant, nous verrons comment créer un site ou une application web en
structurant un peu mieux notre code.
