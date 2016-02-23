angular.module('MyApp', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', 'satellizer', 'nvd3'])
  .config(function($stateProvider, $urlRouterProvider, $authProvider) {

  /*  uiGmapGoogleMapApiProvider.configure({uiGmapGoogleMapApiProvider   , 'uiGmapgoogle-maps'
        key: 'AIzaSyCwtgP3ap8vcxFVkkHwh5bhlM85Ot2YYYQ',
        v: '3.40', //defaults to latest 3.X anyhow
        libraries: 'geometry,visualization'
    });*/


    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/home.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl'
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('crash', {
        url: '/crash',
        templateUrl: 'partials/crash.html',
        controller: 'CrashCtrl'
      })
      .state('crash.comments', {
        url: '/crash/comments',
        templateUrl: 'partials/crash.html',
        controller: 'CrashCtrl',
        views: ''
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          authenticated: function($q, $location, $auth) {
            var deferred = $q.defer();

            if (!$auth.isAuthenticated()) {
              $location.path('/login');
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        }
      });

    $urlRouterProvider.otherwise('/');

    $authProvider.facebook({
      clientId: '846493822102669'
    });

    $authProvider.google({
      clientId: ''
    });

    $authProvider.github({
      clientId: ''
    });

    $authProvider.linkedin({
      clientId: ''
    });

    $authProvider.yahoo({
      clientId: ''
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

    $authProvider.live({
      clientId: ''
    });

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: '',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    });
  });
