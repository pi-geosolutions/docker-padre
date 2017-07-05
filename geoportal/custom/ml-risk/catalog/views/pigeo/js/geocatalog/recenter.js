(function() {

  goog.provide('app.catalog.recenter');

  var module = angular.module('app.catalog.recenter', []);

  var directive = function(appCatalogRecenterService) {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, element, attrs, geoCatctrl) {

        var ctrl = scope.mainCtrl;
        var map = ctrl.map;

        var onFit = function(event) {
          setTimeout(function() {
            if(ctrl.geocatalogOpen) {
              appCatalogRecenterService.recenter(map);
            }
          });
        };

        scope.$watch('mainCtrl.geocatalogOpen', onFit);
        scope.$on('mapfit', onFit);
      }
    };
  };
  module.directive('appCatalogRecenter', [
    'appCatalogRecenterService',
    directive
  ]);

  var recenterService = function() {
    this.recenter = function(map) {
      var offset = parseInt($('#sidebar').css('left'), 10)
        + $('#geocatalog').width();

      var mapSize = map.getSize();
      var mapWidth = mapSize[0];
      var extent = map.getView().calculateExtent(mapSize);
      var ratio = offset / mapWidth;

      var geoWidth = extent[2] - extent[0];
      var translation = geoWidth * ratio / 2;

      extent[0] -= translation;
      extent[2] -= translation;

      map.getView().fit(extent, mapSize);
    };
  }
  module.service('appCatalogRecenterService', [recenterService]);

})();
