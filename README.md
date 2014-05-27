Redécouvrir JavaScript avec Node.js
===================================

Sur ce repository vous trouverez les sources de la dernière version de mon livre _Redécouvrir JavaScript avec Node.js_.

## Licence

Le livre est diffusé sous licence **Creative Commons**, ce qui signifie que vous êtes libre de le partager et de l'adapter, sous certains conditions dont les détails sont visibles ici : http://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr

## Construction du livre en HTML et ePub

Les sources du livre sont au format Markdown ; le livre peut être généré aux formats HTML (page web) et ePub (livre électronique). Pour cela vous aurez besoin du programme [Pandoc](http://johnmacfarlane.net/pandoc/) et de l'utilitaire *make*.

 * Pour générer le HTML : `make html`
 * Pour générer le ePub : `make epub`

Le fichier ePub peut être importé sur la plupart des liseuses ou converti si nécessaire via l'utilitaire [Calibre](http://calibre-ebook.com/).