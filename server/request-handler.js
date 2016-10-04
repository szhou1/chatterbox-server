var _ = require('underscore');
var fs = require('fs');
var shortid = require('shortid');

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  // console.log(request);
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var resultsArray = [];
  var endpoint = request.url.split('?')[0];
  var parameters = request.url.split('?')[1];
  console.log(parameters);

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'applications/json';

  if (endpoint !== '/classes/messages' && endpoint !== '/classes/messages/') {
    var statusCode = 404;
  } else {

    if (request.method === 'GET') {
      statusCode = 200;
      fs.readFile('msgs.json', 'utf8', function(err, data) {
        if (err) {
          return console.log(err);
        }
        if (data) {
          var d = JSON.parse(data);
          resultsArray = d.data;
          if (parameters && parameters.split('=').length > 1 
            && parameters.split('=')[1] === '-createdAt') {
            // console.log('hasidfahskdfjas')
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
    
        response.writeHead(statusCode, headers);
        var res = {results: resultsArray};
        response.end(JSON.stringify(res));
      });

    } else if (request.method === 'POST') {
      statusCode = 201;

      request.on('data', function(chunk) {
        fs.readFile('msgs.json', 'utf8', function(err, data) {
          var fileData = {};

          if (!data) {
            fileData.data = [];
          } else {
            fileData = JSON.parse(data);
          }
          var newData = JSON.parse(chunk);
          newData.objectId = shortid.generate();
          newData.createdAt = new Date();
          fileData.data.push(newData);
          fs.writeFile('msgs.json', JSON.stringify(fileData), 'utf8');
        });

        response.writeHead(statusCode, headers);
        var res = {results: resultsArray};
        response.end(JSON.stringify(res));

      });

    } else if (request.method === 'OPTIONS') {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      var res = {results: resultsArray};
      response.end(JSON.stringify(res));
    }
    
  }

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // // Tell the client we are sending them plain text.
  // //
  // // You will need to change this if you are sending something
  // // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // // .writeHead() writes to the request line and headers of the response,
  // // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // var res = {results: resultsArray};

  // console.log('res', res);

  // // Make sure to always call response.end() - Node may not send
  // // anything back to the client until you do. The string you pass to
  // // response.end() will be the body of the response - i.e. what shows
  // // up in the browser.
  // //
  // // Calling .end "flushes" the response's internal buffer, forcing
  // // node to actually send all the data over to the client.
  // // response.end(JSON.stringify(res));
  // response.end(JSON.stringify(res));
};



exports.requestHandler = requestHandler;