var google_geocoding = require('./google-geocoding');

google_geocoding.geocode('Place de Bretagne, Rennes', function(err, location) {
    if( err ) {
        console.log('Erreur : ' + err);
    } else if( !location ) {
        console.log('Aucun résultat.');
    } else {
        console.log('Latitude : ' + location.lat + ' ; Longitude : ' + location.lng);
    }
});
