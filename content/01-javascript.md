# Chapitre 1 : JavaScript

## 1.1 Historique

JavaScript est un langage créé en 1995 pour le compte du navigateur Netscape.
Sa syntaxe a été ouvertement inspirée de Java. Les deux langages étaient
d'ailleurs présentés en complément (les sociétés Netscape et Sun Microsystems
étant partenaires), ce qui a créé une confusion générale, encore présente
aujourd'hui. Disons-le clairement : JavaScript et Java ne sont pas (ou plus)
du tout liés. (On entend souvent l'analogie "Java is to JavaScript as ham is
to hamster", ou Java est à JavaScript ce que le jambon (ham) est au hamster.)

Depuis, JavaScript a été standardisé par l'organisme _ECMA International_ (le
standard a été nommé _ECMAScript_). C'est un langage qui évolue encore, les
versions 1.7 et 1.8, apportant plusieurs nouvelles possibilités, sont
progressivement supportées par les navigateurs (et par Node.js !).

JavaScript a connu plusieurs essors. Tout d'abord, il a ajouté aux pages HTML
statiques des effets pour les rendre plus dynamiques : des animations au
survol d'une image, des textes defilants, etc. Aujourd'hui ces effets (qui
avaient été globalement nommés _DHTML_ pour _Dynamic_ _ HTML_) nous semblent
un peu vieillots, caractéristiques du web des années 1990-début 2000.

Vers le début des années 2000, JavaScript connaît alors un deuxième essor
majeur, avec l'apparition d'une technologie qui révolutionnera la manière dont
on utilise Internet : Ajax _(Asynchronous JavaScript and XML)_. Pour faire
simple, Ajax consiste à utiliser des possibilités de JavaScript et des
navigateurs pourtant présentes depuis fort longtemps pour faire charger des
données depuis le serveur sans avoir besoin de recharger la page. Cela paraît
simple, pourtant cette avancéea permis de concevoir des applications web
tellement réactives qu'elles se sont progressivement substituées aux
applications de bureau.

Pour faciliter l'utilisation d'Ajax (et notamment pour gérer les différences
d'implémentation entre les navigateurs), plusieurs bibliothèques JavaScript
ont vu le jour ; celle qui fait référence aujourd'hui est _jQuery_
(http://jquery.com).

Enfin, on assiste aujourd'hui à une nouvelle avancée majeure de l'utilisation
de JavaScript. Alors que jQuery permet de faire des appels Ajax et de
manipuler une page HTML très facilement, certains frameworks vont encore plus
loin en créant des applications JavaScript complexes et structurées, par
exemple en donnant la possibilité d'utiliser une architecture _modèle-vue-
controleur (MVC)_, avec gestion de modèles _(templates)_. Et pour accompagner
cette tendance, cela se passe à la fois :

  * côté client : avec des frameworks comme Backbone ou AngularJS ;
  * côté serveur : avec Node.js, c'est l'objet de ce livre !

Il est donc désormais possible d'utiliser avec JavaScript des méthodes
réservées il y a peu aux gros langages comme PHP, Java ou Ruby : architecture
MVC, tests unitaires, _build_, distribution de modules, gestion de dépendances,
etc.

## 1.2 Les bases du langage

Bien que ce livre suppose que vous soyez déjà familier avec JavaScript, il
peut être utile de rappeler quelques bases du langage que même les plus
expérimentés d'entre nous pourraient avoir oublié. Si vous êtes confiant, rien
ne vous empêche de passer au chapitre suivant !

### 1.2.1 Les variables

Une variable se déclare en JavaScript avec l'instruction _var_. On lui affecte
une valeur grâce à l'opérateur _=_ (égal) et les opérateurs arithmétiques bien
connus : _+, -, *, /_, etc.

```javascript
var a;
var b = 1;
a = b + 2;
```

### 1.2.2 Les types simples

Les types de données élémentaires sont également les mêmes que dans les
langages les plus courants :

```javascript
a = true;    // booléen
a = 1;       // entier
a = 1.1;     // flottant
a = "Hello"; // chaîne de caractères
a = 'Hello'; // idem
```

### 1.2.3 Les tableaux et les objets

Parmi les types de données plus complexes, on retrouve d'abord les tableaux,
qui peuvent être initialisés grâce à la notation JSON avec des crochets :

```javascript
var t = [ 1, true, 'Hello' ];
var u = t[0]; // u = 1
```

JSON _(JavaScript Object Notation)_ est un langage permettant de représenter
des données, notamment en JavaScript, bien qu'il puisse être utilisé avec
quasimment tous les langages. Plus d'informations sur
http://www.json.org/json-fr.html.

On trouve également les tableaux associatifs, ou dictionnaires, qui en
JavaScript sont appelés _objets_, et sont initialisés grâce à une notation
avec des accolades :

```javascript
var o = { prop1: 'Hello', prop2: 'World!' };
var v = o['prop1']; // les deux lignes sont
var v = o.prop1;    // équivalentes
```

### 1.2.4 Les fonctions

En JavaScript les fonctions ne sont rien d'autres qu'un type de donnée. Une « fonction » comme on l'entend dans les autres langages est donc en JavaScript
une variable contenant une donnée de type fonction :

```javascript
var f = function(i) {
    return i + 1;
};
```

Il est possible d'utiliser une notation plus conventionnelle :

```javascript
function f() {
    return i + 1;
}
```

Un objet ou un tableau peut donc contenir une fonction :

```javascript
var o = {
    f: function(i) {
        return i + 1;
    }
};
var a =o.f(1); // a = 2
```

### 1.2.5 Mixons le tout

Avec tous ces types de données, on peut créer des objets plutôt complexes :

```javascript
var o = {
    t: 1,
    s: [
        'test',
        function(p) {
            return function(q, f, t) {
                u = q + (f(t))(q);
                return { somme: q + p, produit: q * p };
            };
        }
    ]
};
```
