var express = require('express');
var fs = require('fs');
var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname);

app.get('/', function (req, res) {
  res.render('express02', { title: 'Hello', names: [ 'Pierre', 'Paul', 'Jacques' ] });
});

app.get('/hello/:name', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello ' + req.params.name + '!' }));
});

app.listen(3333);
