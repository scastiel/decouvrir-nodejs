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