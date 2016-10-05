/* Import node's http module: */
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
// var shortid = require('shortid');
var path = require('path');
var rh = require('./request-handler');
// var html = require('html');
var app = express();
app.set('port', 3000);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // res.header('Content-Type', 'application/json');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '/client')));
// app.use('/styles', express.static(path.join(__dirname, '/client/styles')));

// app.use(express.static(path.join(__dirname + '/client/styles/styles.css')));

// app.get('/', function(req, response) {

//   console.log('get request at /');
//   // console.log(path.join(__dirname, 'client'));
  
//   response.sendFile(path.join(__dirname, '/client', '/styles/styles.css'));

//   // response.send();
// });

app.get('/classes/messages/', rh.requestHandler.getData);


app.post('/classes/messages/', rh.requestHandler.postData);
//   console.log('post request');
//   console.log(request.body);
//   // console.log(request.body.username);
//   var obj = request.body;
//   var newData = obj;
//   fs.readFile('msgs.json', 'utf8', function(err, data) {
//     var fileData = {};

//     if (!data) {
//       fileData.data = [];
//     } else {
//       fileData = JSON.parse(data);
//     }
//     newData.objectId = shortid.generate();
//     newData.createdAt = new Date();
//     fileData.data.push(newData);
//     // console.log('before writing file', newData);

//     fs.writeFile('msgs.json', JSON.stringify(fileData), 'utf8');
//     // console.log('after reading and writing');
//     var res = {results: newData};
//     response.json(res);
//   });
// });

app.listen(3000, function() {
  console.log('listening...');
});