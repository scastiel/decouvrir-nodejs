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
    console.log("Bonjour, je m'appelle " + this.nom + " !");
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
