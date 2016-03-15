var mongoose = require('mongoose');
var User = require('../models/UserSchema.js');
var DataPoint = require('../models/DatapointSchema.js');
var auth = require('../authentication/auth.js');
var jwt = require('jwt-simple');
var request = require('request');
var qs = require('querystring');
var async = require('async');
var config = require('../config.js');

var routes = function(app) {
  /*
   |--------------------------------------------------------------------------
   | GET /api/me
   |--------------------------------------------------------------------------
   */

   app.get('/', function(req, res) {
     console.log('got route');

     var data = {
       lat_long: [[63.568138,10.295417],[63.314919,10.752056],[63.108749,11.5345],[63.086418,11.648694],[63.827442,10.371333],[62.961193,10.090278],[62.743168,9.291194],[63.122833,10.591667],[63.123749,9.443389],[63.210278,10.70875],[63.016499,10.958944],[63.163502,10.526361],[62.112194,11.48656],[63.019974,9.197861],[63.328529,11.027583],[63.390305,11.418528],[63.141998,11.722361],[63.147141,9.11575],[62.876141,9.661972],[62.821918,10.608694],[62.7085,9.800861],[62.412193,11.18656],[62.550045646,12.050345356]],
       speed: [22, 48, 49, 50, 50, 51, 48, 50, 50, 48, 51, 52, 54, 55, 55, 55, 56, 56, 55, 54, 57, 55, 54, 55, 54, 56, 56, 56, 56, 54, 56, 56, 54, 56, 55, 54, 56, 56, 54]
     };
     res.render('index.html', data);
   });

   app.post('/api/get_data_from_crash', auth.ensureAuthenticated, function(req, res) {
     User.findById(req.user, function(err, user) {
       if (err) {
         throw err;
       }
       if (!user) {
         return res.status(406).send({ data: datapoints, status: 1300 });
       }

       Datapoint.find({ owner_id: req.body.owner_id }, function(err, datapoints) {
         if (err) {
           throw err;
         }
         return res.status(200).send({data: datapoints});
       }).sort({ timestamp: -1 });
     })
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
         return res.status(200).send({message: 'Datapoint saved'});
       });
     });
   });

   app.post('/api/add_bulk_data', function(req, res) {

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
