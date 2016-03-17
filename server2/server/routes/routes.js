var mongoose = require('mongoose');
var User = require('../models/UserSchema.js');
var DataPoint = require('../models/DatapointSchema.js');
var auth = require('../authentication/auth.js');
var jwt = require('jwt-simple');
var request = require('request');
var qs = require('querystring');
var async = require('async');
var config = require('../config.js');

var routes = function(app, io) {
  /*
   |--------------------------------------------------------------------------
   | GET /api/me
   |--------------------------------------------------------------------------
   */

   app.get('/', function(req, res) {
     res.render('index.html');
   });

   app.post('/api/get_data_from_crash', auth.ensureAuthenticated, function(req, res) {
     User.findById(req.user, function(err, user) {
       if (err) {
         throw err;
       }
       if (!user) {
         return res.status(406).send('user not found');
       }

       DataPoint.find({ owner_id: req.user }, function(err, datapoints) {
         if (err) {
           throw err;
         }
         console.log(datapoints);
         return res.status(200).send({data: datapoints});
       }).sort({ timestamp: 1 });
     });
   });

   app.post('/api/update_owner', auth.ensureAuthenticated, function(req, res) {
     User.findById(req.user, function(err, user) {
       if (!user) {
         return res.status(400).send({ message: 'User not found' });
       }
       user.first_name = req.body.first_name || user.first_name;
       user.last_name = req.body.last_name || user.last_name;
       user.email = req.body.email || user.email;
       user.postal_code = req.body.postal_code || user.postal_code;
       user.address = req.body.address || user.address;
       user.social_security_number = req.body.social_security_number || user.social_security_number;
       user.phone_number = req.body.phone_number || user.phone_number;
       user.save(function(err) {
         res.status(200).end();
       });
     });
   });

   app.get('/send/:data', function(req, res) {
     io.emit("send", {hello: "world"});
     return res.status(200).send('sent');
   });


   app.post('/api/add_data', function(req, res) {
     console.log(req.body);
     User.findOne({ pi_id: req.body.pi_id }, function(err, user) {
       if (err) {
         throw err;
       }
       if (!user) {
         return res.status(400).send({ message: 'PI not found' });
       }
       var newPoint = new DataPoint({
         owner_id: user._id,
         timestamp: req.body.timestamp,
         latitude: req.body.latitude,
         longditude: req.body.longitude,
         engine_speed: req.body.engineSpeed,
         vehicle_speed: req.body.vehicleSpeed,
         accelerator_pedal_position: req.body.acceleratorPedal,
         brake_pedal_status: req.body.breakingPedal
       });
       newPoint.save(function(err) {
         console.log(err);
         if (err) {
           throw err;
         }
         io.emit("got_data");
         return res.status(200).send({message: 'Datapoint saved'});
       });
     });
   });

   app.post('/api/add_bulk_data', function(req, res) {
     console.log(req.body);
     User.findOne({ pi_id: req.body.lines[0].pi_id }, function(err, user) {
       if (err) {
         throw err;
       }
       if (!user) {
         return res.status(400).send({ message: 'PI not found' });
       }
       async.forEach(req.body.lines, function(line, cb) {
         var newPoint = new DataPoint({
           owner_id: user._id,
           timestamp: line.timestamp,
           latitude: line.latitude,
           longditude: line.longitude,
           engine_speed: line.engineSpeed,
           vehicle_speed: line.vehicleSpeed,
           accelerator_pedal_position: line.acceleratorPedal,
           brake_pedal_status: line.breakingPedal
         });
         newPoint.save(function(err) {
           if (err) {
             cb(err);
           }
           cb();
         });
       }, function(err) {
         if (err) {
           throw err;
         }
         io.emit("got_data");
         return res.status(200).end();
       });
     });
   });

  app.get('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
      res.send(user);
    });
  });

  /*
   |--------------------------------------------------------------------------
   | PUT /api/me
   |--------------------------------------------------------------------------
   */
  app.put('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

  app.post('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      console.log('hello');
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });
}

module.exports = routes;
