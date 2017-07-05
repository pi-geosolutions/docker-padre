(function() {

  goog.provide('app.auth');

  var module = angular.module('app.auth', []);


  gn.authDirective = function() {
    return {
      restrict: 'E',
      scope: true,
      controller: 'AppAuthController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '../../catalog/views/pigeo/js/auth/auth.html'
    };
  };

  module.directive('appAuth', gn.authDirective);

  gn.AuthController = function($http, $scope) {
    this.$http = $http;
    this.$scope = $scope;

  };


  gn.AuthController['$inject'] = [
    '$http', '$scope'
  ];

  module.controller('AppAuthController', gn.AuthController);

})();