var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var session = require('express-session');
var path = require('path');

var routeHandler = require('./routeHandler');

var app = express();

app.use(session({
  secret: 'secretttt',
   resave: false,
   saveUninitialized: true
   }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/../client/')));

var port = process.env.PORT || 8000;
console.log('Server listening on ' + port);

app.use(routeHandler).listen(port);

module.exports = app;
