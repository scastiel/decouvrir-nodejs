var http = require("http");

module.exports.geocode = function(address, callback) {
    var url = "http://maps.googleapis.com/maps/api/geocode/json?address="
        + encodeURIComponent(address) + "&sensor=false";
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