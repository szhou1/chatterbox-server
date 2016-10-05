var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var mongo = require('mongodb').MongoClient;
var data = [];

var requestHandler = {

  insertDocuments: function(db, callback, msg) {
    var collection = db.collection('documents');
    collection.insertMany([msg], 
      function(err, result) {
        // console.log(result);
        callback(result);
      }
    );
  },

  getDocuments: function(db, callback) {
    var collection = db.collection('documents');

    collection.find({}).toArray( 
      function(err, docs) {
        // console.log(docs.length);
        callback(docs);
      } 
    );
  },

  getData: function(req, response) {
    // console.log('get request!');

    var url = 'mongodb://localhost:27017/data';
    mongo.connect(url, function(err, db) {  
      // console.log('Connected successfully to server!');

      requestHandler.getDocuments(db, function(msgs) {
        data = msgs;
        db.close();
      });
    });
    
    var resultsArray = data;
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

    var res = {results: resultsArray};
    response.json(res);
  },

  postData: function(request, response) {
    // console.log(request.body)

    var url = 'mongodb://localhost:27017/data';
    var msg = request.body;
    msg.objectId = shortid.generate();
    msg.createdAt = new Date();

    mongo.connect(url, function(err, db) {  
      console.log('Connected successfully to server!');

      requestHandler.insertDocuments(db, function() {
        db.close();
      }, msg);
    });

    response.json({results: [msg]});
  }
};


exports.requestHandler = requestHandler;