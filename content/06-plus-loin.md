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

```coffeescript
mood = greatlyImproved if singing
if happy and knowsIt
	clapsHands()
	chaChaCha()
else
	showIt()
date = if friday then sue else jill
```

Après compilation, voici le JavaScript généré :

```javascript
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
```

C'est lorsque l'on commence à utiliser des classes et des objets
que CoffeeScript révèle tout son potentiel. En effet la programmation objet
n'existe pas en JavaScript, bien que des techniques permettent de faire tout
comme, mais au prix d'un code encore plus difficilement compréhensible.
CoffeeScript peut alors rendre les choses beaucoup plus faciles !

C'est ainsi que s'achève notre exploration de Node.js. J'espère que vous aurez
pris autant de plaisir à lire ce livre que j'en ai eu à l'écrire. J'espère
aussi vous avoir donné envie d'en savoir plus sur Node.js et JavaScript en
général. Nul doute que JavaScript a encore de beaux jours devant lui !
