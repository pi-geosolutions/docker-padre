(function() {

  goog.provide('app.query.geodash');

  var module = angular.module('app.query.geodash', []);
  
  gn.QueryGeodashDirective = function() {
    return {
      restrict: 'E',
      scope: {
        map: '<appQueryGeodashMap',
        active: '=appQueryGeodashActive',
        vector: '<appQueryGeodashVector'
      },
      controller: 'AppQueryGeodashController',
      controllerAs: 'ctrl',
      bindToController: true
    };
  };

  module.directive('appQueryGeodash', gn.QueryGeodashDirective);

  gn.QueryGeodashController = function($http, $scope, gnViewerSettings) {
    this.$http = $http;
    this.$scope = $scope;

    this.geodashUrl = gnViewerSettings.geodashUrl;

    $scope.$watch(function() {
      return this.active;
    }.bind(this), function(drawActive) {
      if(angular.isDefined(drawActive)) {
        this.drawInteraction.setActive(drawActive);
        if(!drawActive) {
          this.vector.getSource().clear();
        }
      }
    }.bind(this));

    this.drawInteraction = new ol.interaction.Draw({
      type: 'Point',
      style: this.vector.getStyle(),
      source: this.vector.getSource()
    });
    this.map.addInteraction(this.drawInteraction);
    this.drawInteraction.setActive(false);

    this.drawInteraction.on('drawend', this.handleDrawEnd_.bind(this));
    this.drawInteraction.on('drawstart', this.handleDrawStart_.bind(this));
  };

  gn.QueryGeodashController.prototype.handleDrawEnd_ = function(e) {
    var f = e.feature.clone();
    var coords = f.getGeometry().transform(this.map.getView().
    getProjection(), 'EPSG:4326').getCoordinates();

    window.open(this.geodashUrl +'lon=' + coords[0] + '&lat=' + coords[1],
    'geodash');
  };

  gn.QueryGeodashController.prototype.handleDrawStart_ = function(e) {
    this.vector.getSource().clear();
  };


  gn.QueryGeodashController['$inject'] = [
    '$http', '$scope', 'gnViewerSettings'
  ];

  module.controller('AppQueryGeodashController', gn.QueryGeodashController);

})();