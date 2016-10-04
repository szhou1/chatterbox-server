/* Import node's http module: */
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Content-Type', 'application/json');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/classes/messages/', function(req, response) {
//  console.log('get request!');

  fs.readFile('msgs.json', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    if (data) {
      var d = JSON.parse(data);
      var resultsArray = d.data;
      // var order = req.query.order;
      if (req.query.order === '-createdAt') {        
        resultsArray.sort(function(a, b) {
          if (a.createdAt < b.createdAt) {
            return 1;
          } else if (a.createdAt > b.createdAt) {
            return -1;
          } else {
            return 0;
          }
        });
      }
    }

    var res = {results: resultsArray};
    response.json(res);
  });
});

app.post('/classes/messages/', function(request, response) {
  console.log('post request');
  console.log(request.body);
  // console.log(request.body.username);
  var obj = request.body;
  var newData = obj;
  fs.readFile('msgs.json', 'utf8', function(err, data) {
    var fileData = {};

    if (!data) {
      fileData.data = [];
    } else {
      fileData = JSON.parse(data);
    }
    newData.objectId = shortid.generate();
    newData.createdAt = new Date();
    fileData.data.push(newData);
    // console.log('before writing file', newData);

    fs.writeFile('msgs.json', JSON.stringify(fileData), 'utf8');
    // console.log('after reading and writing');
    var res = {results: newData};
    response.json(res);
  });
});

app.listen(3000, function() {
  console.log('listening...');
});