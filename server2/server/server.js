/**
 * Satellizer Node.js Example
 * (c) 2015 Sahat Yalkabov
 * License: MIT
 */

var path = require('path');
var qs = require('querystring');

var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');
var User = require('./models/UserSchema.js');
var auth = require('./authentication/auth.js');
var clients = [];

var config = require('./config');

mongoose.connect(config.db.url);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', 3000);
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}
app.use(express.static(path.join(__dirname, '../client')));
app.set('views', '../client/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

io.on('connection', function (socket) {
  console.log('CONNECTION');
  socket.emit('send', { hello: 'world' });
});


  /*
app.io.route('ready', function(req) {
    // respond to the event
});

app.io.sockets.on('connection', function(socket) {

  console.log('CONNECTION');

  socket.emit('connected', 'connecting', function(token) {
    console.log(token);
    //Checking if token exists
    if (token != null) {
      //Returns the user_id if the token is valid
      var id = auth.ensureSocketAuthenticated(token);
      if (id != 401) {

        //Creating a token with the user_id + socket_id to query the Redis-database easier
        var redis_search_token = id +  socket.id;

        //Makes sure a user is not in the database with multiple socket_id's by deleting all other keys with this id
        client.keys(id + '*', function(err, keys) {
          for (var i = 0; i < keys.length; i++) {
            client.del(keys[i]);
          }

          //Sets new key with the user_id + socket_id so that other users can check if a user is online
          client.set(redis_search_token,0,function(err) {
          });
        });
      }
    }
  });

  socket.on('disconnect', function() {
    console.log('disconnecting');
    console.log(socket.id);
    client.keys('*' + socket.id, function(err, keys) {
      for (var i = 0; i < keys.length; i++) {
        client.del(keys[i]);
      }
    });
  });
  socket.on('connection', function(token) {

    console.log(token);
    //Checking if token exists
    if (token != null) {
      //Returns the user_id if the token is valid
      var id = auth.ensureSocketAuthenticated(token);
      if (id != 401) {

        //Creating a token with the user_id + socket_id to query the Redis-database easier
        var redis_search_token = id + socket.id;

        //Makes sure a user is not in the database with multiple socket_id's by deleting all other keys with this id
        client.keys(id + '*', function(err, keys) {
          for (var i = 0; i < keys.length; i++) {
            client.del(keys[i]);
          }

          //Sets new key with the user_id + socket_id so that other users can check if a user is online
          client.set(redis_search_token,0,function(err) {
          });
        });
      }
    }
  });


});
  */

server.listen(3000);

// require routes
require('./routes/routes.js')(app, io);
require('./routes/loginRoutes.js')(app);
