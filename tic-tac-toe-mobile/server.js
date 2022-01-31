var express  = require('express');
var app = express();
const path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/www'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/www/index.html'));
})

var PORT = process.env.PORT || 8100
app.listen(PORT, function () {
  console.log('Express server listening on port ' + PORT);
});
