# Chapitre 4 : Utiliser des bases de données

Dans la plupart des applications que nous développons, il est nécessaire
d'avoir un mécanisme de persistance des données, et le moyen le plus robuste
et le plus employé est d'utiliser une base de données. Avec Node.js,
l'objectif n'est pas de faire appel aux gros systèmes de gestion de base de
données comme MySQL ou Oracle (bien que cela soit possible, on préfèrera
passer par l'intermédiaire d'une API ou d'un webservice externe pour cela),
mais utiliser un système plus souple et plus léger.

Nous verrons dans ce chapitre deux systèmes fréquemment utilisés avec Node.js.
Le premier est _SQLite3_, dont le principe est de stocker une base dans un
fichier, et d'y accéder grâce au langage SQL. Le second, _MongoDB_ est
radicalement différent ; les données qui y sont stockées ressemblent
étrangement à du format JSON, c'est-à-dire que les données sont organisées
hiérarchiquement et non sous forme de tables. Il fait partie de la famille des
systèmes de gestion de base de données _NoSQL (Not Only SQL)_.

## 4.1 Sqlite3

### 4.1.1 Présentation

Créé initialement pour être intégré dans des systèmes de missiles au début des
années 2000, SQLite est un système de gestion de bases de données ultraléger
dont le principal intérêt est qu'il ne nécessite pas de serveur. Une base de
données n'est qu'un fichier stocké localement. Notamment, il n'y a pas de
gestion d'utilisateurs : si un programme a le droit d'accéder au fichier,
alors il peut accéder à la base de données.

Cela rend SQLite relativement facile à prendre en main et à maintenir. Son
utilisation principale n'est pas la gestion de grosses bases de données métier,
on réservera cela aux gros MySQL, Oracle, SQL Server… Mais il est extrêmement
utilisé par exemple pour stocker des données de configuration, ou encore des
données mises en cache, pour soulager la base de données principale d'un gros
système. Notamment, SQLite est extrêmement utilisé dans les applications
mobiles (iPhone notamment) : on imagine mal un serveur MySQL tourner sur un
mobile, mais une base de données SQLite permet un accès plus facile aux
données stockées que si elles l'étaient dans des fichiers.

L'utilisation de SQLite avec Node.js se fait avec le module _sqlite3_ : `npm
install sqlite3`. Rien à installer à part ça, SQLite ne requiert pas de serveur
!

### 4.1.2 Premier exemple

Une fois le module installé, passons à un exemple très simple :

```javascript
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(':memory:');

db.serialize(function() {
	db.run("create table users (login, name)");

	var stmt = db.prepare("insert into users values (?, ?)");
	var users = [ { login: 'pierre',  name: 'Pierre' },
	              { login: 'paul',    name: 'Paul' },
	              { login: 'jacques', name: 'Jacques' } ];

	for (var i in users) {
		stmt.run(users[i].login, users[i].name);
	}

	db.each("select login, name from users", function(err, row) {
		console.log(row.login + ": " + row.name);
	});
});
```

Comme à l'habitude, nous commençons par inclure notre module fraîchement
installé _sqlite3_.

```javascript
var db = new sqlite3.Database(':memory:');
```

Nous créons ensuite un objet _Database_ sur lequel nous effectuerons nos
requêtes. Le paramètre est le nom du fichier de base de données que nous
souhaitons utiliser ; pour nos premiers tests,  `':memory:'`  nous permet
d'utiliser une base temporaire qui sera détruite à la fin de l'exécution. Ce
n'est bien entendu que pour faciliter la compréhension ; peu d'intérêt dans
une application finale.

```javascript
db.serialize(function() {
	...
});
```

Nous englobons le code de notre application dans une fonction que nous passons
en paramètre la méthode `serialize` de notre objet `db`. Cela nous permet
d'indiquer que les requêtes qui sont exécutées dans cette fonction doivent
être exécutées de manière séquentielle, c'est-à-dire l'une après l'autre (en
opposition au mode parallèle dans lequel toutes les requêtes sont exécutées en
même temps).

```javascript
db.run("create table users (login, name)");
```

Ici, grâce à la méthode `db.run`, nous exécutons une simple requête SQL, en
l'occurrence nous créons une table _users_ composée de deux colonnes : _login_
et _name_. Notez que SQLite n'est pas très exigeant sur le typage des données.
Par défaut, les colonnes sont de type _chaîne_.

```javascript
var stmt = db.prepare("insert into users values (?, ?)");
var users = [ { login: 'pierre',  name: 'Pierre' },
              { login: 'paul',    name: 'Paul' },
              { login: 'jacques', name: 'Jacques' } ];

for (var i in users) {
	stmt.run(users[i].login,users[i].name);
}
```

Nous créons ensuite un _statement_, ce que l'on peut voir comme un modèle de
requête. En effet dans la requête `insert`, les points d'interrogation seront
remplacés par des valeurs qui seront automatiquement mises au bon format (avec
les guillemets, les caractères d'échappement…).

Les données que nous allons insérer dans notre table _users_ sont contenues
dans le tableau `users`. Nous bouclons donc sur les éléments de ce tableau, puis
pour chacun nous appelons la méthode `stmt.run`, ce qui aura pour conséquence
d'utiliser la requête (le _statement_) que nous venons de définir, en
utilisant les bonnes valeurs, passées en paramètre.

```javascript
db.each("select login, name from users", function(err, row) {
	console.log(row.login + ": " + row.name);
});
```

Après avoir inséré nos valeurs dans la base, nous allons les lire, en
utilisant la méthode `db.each`. Cette méthode exécute une requête, mais
contrairement à `db.run` que nous avons vue plus haut, celle-ci nous permet de
récupérer le résultat de son exécution, en l'occurrence les enregistrements
retournés.

Pour cela, nous fournissons à `db.each` une fonction de rappel qui sera exécutée
pour chaque enregistrement renvoyé, enregistrement qui sera passé en second
paramètre, le premier étant l'erreur éventuelle.

Il existe également une méthode `db.all` qui permet d'accéder à tous les
résultats de la requête en même temps, ce qui peut être utile pour compter les
résultats par exemple, ou encore pour effectuer un traitement sur plusieurs
résultats à la fois.

Exécutons notre exemple :

```sh
$ node sqlite01.js
pierre: Pierre
paul: Paul
jacques: Jacques
```

### 4.1.3 Deuxième exemple

Dans ce deuxième exemple à peine plus complexe, nous allons cette fois-ci
utiliser un fichier où stocker notre base de données SQLite. Le but sera de
stocker les dates et heures d'appel du script dans cette base, afin de les
afficher à chaque exécution.

```javascript
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('sqlite02.db');

db.serialize(function() {
	db.run("create table if not exists log (date)");
	db.all("select date from log", function(err, rows) {
		if( rows.length == 0 )
		{
			console.log("Première exécution !");
		}
		else
		{
			for( var i in rows )
			{
				console.log(rows[i].date);
			}
		}
	});

	var date = new Date().toLocaleString();
	var stmt = db.prepare("insert into log values (?)");
	stmt.run(date);
});
```

Nous utilisons à présent le fichier _sqlite02.db_ pour stocker nos données, où
nous créons une table _log_ si celle-ci n'existe pas déjà (`if not exists`). La
table ne contient qu'un seul champ : _date_.

Nous commençons par exécuter la requête `select date from log` qui nous renvoie
les dates d'exécution du script. S'il n'y a pas d'enregistrements renvoyés
(`rows.length == 0`), nous affichons qu'il s'agit de la première exécution du
script. Sinon, nous affichons les dates.

Puis nous insérons en base la date courante afin que celle-ci soit affichée
pour les prochaines exécutions.

Si vous exécutez ce script plusieurs fois, vous aurez un affichage similaire à
celui-ci :

```
$ node sqlite02.js
Première exécution !

$ node sqlite02.js
Fri Sep 13 2013 13:10:40 GMT+0200 (Paris, Madrid (heure d'été))

$ node sqlite02.js
Fri Sep 13 2013 13:10:40 GMT+0200 (Paris, Madrid (heure d'été))
Fri Sep 13 2013 13:10:55 GMT+0200 (Paris, Madrid (heure d'été))
```

### 4.1.4 Aller plus loin avec un ORM

Si vous avez déjà dévéloppé des applications utilisant une base de données SQL,
vous n'êtes pas sans savoir qu'il peut être pénible d'avoir à se soucier des
requêtes SQL, de leur syntaxe, notamment lorsqu'il s'agit de faire des
requêtes sur plusieurs tables en même temps.

On préfère donc utiliser par exemple un ORM _(object-relational mapping)_ qui
permet de traiter les données en base comme des objets. Par exemple, avec
l'ORM _Sequelize_ (http://sequelizejs.com) nous pouvons définir un modèle
_User_ correspondant à la table _users_ utilisée dans notre premier exemple :

```javascript
var User = sequelize.define('User', {
	login: { type: Sequelize.STRING, primaryKey: true },
	name:Sequelize.STRING
});
```

Sequelize peut ensuite créer automatiquement notre table :

```javascript
User.sync();
```

Puis nous pouvons requêter sur nos utilisateurs grâce à la méthode find.

```javascript
User.find('pierre').success(function(user) {
	console.log(user.values.name);
});
```

Sequelize permet de manipuler d'autres bases de données qu'SQLite comme MySQL
ou PostgreSQL, et il existe d'autres ORM disponibles. N'hésitez pas rechercher
celui qui correspondra le mieux à vos besoins.

## 4.2 MongoDB

MongoDB se distingue des systèmes de gestion de base de données traditionnels
par le type d'objet qu'il peut stocker et sa manière de les stocker. Ici pas
de tables et de relations (comme des clés étrangères). Vous stockez des objets
constitués de propriétés, dont les valeurs peuvent être d'autres objets. Cela
vous rappelle quelque chose ? Oui, c'est ouvertement inspiré des objets
JavaScript auxquels vous devez commencer à être habitués !

### 4.2.1 Le shell de MongoDB

Première chose à faire : installer MongoDB. Vous pouvez utiliser le
gestionnaire de paquets de votre système, ou bien télécharger le programme sur
le site de MongoDB (http://www.mongodb.org/).

Une fois installé, vous pouvez lancer le shell de MongoDB par la commande
`mongo`. Créons notre première base de données, et appelons-la `mabase` :

```
> use mabase;
switched to db mabase

> db
mabase
```

Comme vous le voyez, pour créer une base il suffit de vouloir l'utiliser ! Une
fois que vous avez déclaré à Mongo que vous souhaitiez utiliser la base
`mabase`, c'est par l'objet `db` que vous y accédez.

Commençons par insérer quelques données dans notre base :

```
> db.utilisateurs.save({ nom: 'Pierre', adresse: { voie: 'Avenue des Rues',
ville: 'Rennes' } });

> db.utilisateurs.save({ nom: 'Jacques', adresse: { voie: 'Rue des Avenues',
ville: 'Paris' } });

> db.utilisateurs.save({ nom: 'Paul' });
```

Pour ce qui est de la terminologie Mongo, nous venons ici d'insérer trois
_documents_ dans une _collection_. Vous constaterez que les documents d'une
collection peuvent être hétérogènes ; évidemment il vaut mieux éviter qu'ils
le soient trop.

Pour vérifier le contenu de notre collection, nous utilisons la méthode `find`
de l'objet `db`, à laquelle nous pouvons donner des critères de recherche.

```
> db.utilisateurs.find();
{ "_id" : ObjectId("5238b1c15fe1afba9cec2027"), "nom" : "Pierre", "adresse" : { "voie" : "Avenue des Rues", "ville" : "Rennes" } }
{ "_id" : ObjectId("5238b1c95fe1afba9cec2028"), "nom" : "Jacques", "adresse" : { "voie" : "Rue des Avenues", "ville" : "Paris" } }
{ "_id" : ObjectId("5238b1d05fe1afba9cec2029"), "nom" : "Paul" }

> db.utilisateurs.find({ nom: 'Pierre' });
{ "_id" : ObjectId("5238b1c15fe1afba9cec2027"), "nom" : "Pierre", "adresse" : { "voie" : "Avenue des Rues", "ville" : "Rennes" } }

> db.utilisateurs.find({ 'adresse.ville': 'Paris' });
{ "_id" : ObjectId("5238b1c95fe1afba9cec2028"), "nom" : "Jacques", "adresse" : { "voie" : "Rue des Avenues", "ville" : "Paris" } }
```

Pour mettre à jour un document, nous utilisons la méthode update :

```
>db.utilisateurs.update( { nom: 'Paul' }, { nom: 'Paul', nb: 3 } );

>db.utilisateurs.find( { nom: 'Paul' } );
{ "_id" :ObjectId("5238b1d05fe1afba9cec2029"), "nom" : "Paul", "nb" : 3 }
```

À présent que vous connaissez les bases de MongoDB, voyons comment utiliser
tout ça avec Node.js.

### 4.2.2 MongoDB avec Node.js : Mongoose

Il existe plusieurs modules permettant d'accéder à MongoDB en Node.js. Le
module de base est _mongodb_, qui fournit une interface permettant d'effectuer
des opérations sur une base de la même manière que nous venons de le faire
avec le shell _mongo_. Le module _mongoose_ est un autre module officiel, qui
en se basant sur _mongodb_ introduit une couche supplémentaire facilitant la
manipulation des données grâce à une couche ODM _(object-document mapper)_,
équivalent pour les documents des ORM _(object-relational mapper)_.

Pour installer _mongoose_ : `npm install mongoose`. Remarquez que _mongoose_
requiert le module _mongodb_.

Voici le code source de notre exemple.

```javascript
var mongoose = require('mongoose');

// 1- Déclaration du modèle
var utilisateurSchema = mongoose.Schema({
	nom: String,
	nb: Number,
	adresse: {
		voie: String,
		ville: String
	}
});
utilisateurSchema.methods.hello = function() {
	console.log("Bonjour, je m'appelle " +this.nom + " !");
};
var Utilisateur = mongoose.model('utilisateurs', utilisateurSchema);

// 2- Opérations sur les données
var db = mongoose.connection;
db.once('open', function() {
	var pierre = new Utilisateur({
		nom: 'Pierre',
		adresse: {
			voie: 'Avenue des Rues',
			ville: 'Rennes'
		}
	});
	pierre.save(function(err, utilisateur) {
		utilisateur.hello();
		mongoose.disconnect();
	});
});

mongoose.connect('mongodb://localhost/mabase2');
```

J'ai séparé le code source en deux parties, la première constituée de la
déclaration du modèle, et la seconde d'exemples d'opérations possibles sur les
données grâce à ce modèle.

#### 4.2.2.1 Déclaration du modèle

Tout d'abord nous déclarons un _schéma_, `utilisateurSchema`. Un schéma permet
de définir une structure au document que nous allons utiliser, une sorte de
modèle (à ne pas confondre avec les modèles que nous allons voir par la
suite). Pour notre schéma d'utilisateur, nous déclarons trois attributs :

* `nom`, de type chaîne de caractère _(String)_ ;
* `nb`, de type nombre _(Number)_ ;
* et `adresse`, objet contenant un attribut voie et un attribut `ville`.

Nous déclarons ensuite dans ce schéma une _méthode_ appelée `hello`. Nous
pourrons alors appeler cette méthode sur n'importe quel objet héritant de
notre schéma ; nous y reviendrons.

À partir de ce schéma, nous créons un _modèle_ que nous appelons `Utilisateur`,
que nous associons à la collection Mongo `utilisateurs`. Si vous êtes habitués à
la programmation objet, ce modèle représente en quelque sorte une classe, à
partir de laquelle nous allons pouvoir créer nos objets utilisateurs.

#### 4.2.2.2 Opérations sur les données

Nous déclarons tout d'abord un objet db qui nous permet d'accéder à notre base
Mongo : `var db = mongoose.connection;`.

Puis, par la méthode `once` de notre objet `db` nous déclarons quoi faire lorsque
nous sommes parvenus à nous connecter à la base, en passant comme paramètre
une fonction appelée alors.

Dans cette fonction, nous commençons par créer un objet utilisateur nommé
`pierre`, à partir du modèle `Utilisateur`. Nous initialisons cet objet avec des
données : son nom et son adresse. Notez que nous ne définissons par l'attribut
`nb` déclaré dans le schéma, rien ne nous oblige à le faire tout de suite.

Enfin, nous enregistrons cet objet `pierre`, autrement dit nous le créons dans
la base Mongo. La fonction donnée en paramètre à la méthode `save` a deux
paramètres, le premier étant l'erreur éventuelle, le second l'objet
effectivement enregistré.

Une fois l'utilisateur enregistré, nous appelons sa méthode `hello` (que nous
avions déclarée dans le schéma `utilisateurSchema`, puis nous fermons la
connexion via `mongoose.disconnect()`.

Nous avons déclaré les actions à effectuer lorsque nous étions connecté à la
base ; encore faut-il s'y connecter effectivement : avec
`mongoose.connect('mongodb://localhost/mabase2')`, nous nous connectons à la
base `mabase2` sur le serveur local.

#### 4.2.2.3 Exécution de l'exemple

Pour exécuter l'exemple, il est nécessaire de lancer le serveur MongoDB s'il
est pas déjà en cours d'exécution. Cela se fait à l'aide du programme `mongod`.
Il est possible que vous deviez passer en paramètre de ce programme le chemin
du répertoire de stockage des bases Mongo. Par exemple sous Windows : `mongod
-dbpath C:\Temp\mongodb`.

Une fois que notre serveur MongoDB tourne, nous pouvons exécuter le script :

```
$ node mongoose01.js
Bonjour, je m'appelle Pierre !
```

### 4.2.3 Conclusion sur MongoDB

Nous avons donc vu les rudiments de MongoDB et de son utilisation avec
Node.js. Bien évidemment, MongoDB permet des opérations bien plus complexes
que celles que nous venons de voir, je vous encourage à feuilleter la
documentation de MongoDB et du module _mongoose_.
