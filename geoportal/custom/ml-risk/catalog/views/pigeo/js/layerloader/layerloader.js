(function() {

  goog.provide('app.layerloader');

  var module = angular.module('app.layerloader', []);


  gn.layerloaderDirective = function() {
    return {
      restrict: 'E',
      scope: {
        map: '<appLayerloaderMap'
      },
      controller: 'AppLayerloaderController',
      controllerAs: 'ctrl',
      bindToController: true,
      template: '<i ng-if="ctrl.loading" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>'
    };
  };

  module.directive('appLayerloader', gn.layerloaderDirective);

  gn.Layerloader = function($scope) {
    this.loadingLayer = [];

    this.map.getLayers().on('add', function(event) {

      this.loadingLayer = [];
      this.map.getLayers().forEach(function(layer) {
        if(angular.isDefined(layer.loading)) {
          this.loadingLayer.push(function() {
            return layer.loading;
          });
        }
      }.bind(this));

      if(angular.isFunction(this.unregisterFn)) {
        this.unregisterFn();
      }
      this.unregisterFn = $scope.$watchGroup(this.loadingLayer, this.isMapLoading.bind(this));

    }.bind(this));
  };

  gn.Layerloader.prototype.isMapLoading = function(watchers) {
    if(watchers.length) {
      this.loading = watchers.some(function(c) {
        return c;
      });
    }
  };

  gn.Layerloader['$inject'] = [
    '$scope'
  ];

  module.controller('AppLayerloaderController', gn.Layerloader);

})();
