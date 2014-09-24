var should = require('should');
var google_geocoding = require('../google-geocoding');

describe('Google geocoding', function() {
    describe('#geocode()', function() {
        it('should return null on incorrect address', function(done) {
            google_geocoding.geocode('tototititutu', function(err, location) {
                should.not.exist(err);
                should.not.exist(location);
                done();
            });
        });

        it('should return non null on correct address', function(done){
            google_geocoding.geocode('Place de Bretagne, Rennes', function(err, location) {
                should.not.exist(err);
                location.should.have.property('lat');
                location.should.have.property('lng');
                done();
            });
        });
    });
});
