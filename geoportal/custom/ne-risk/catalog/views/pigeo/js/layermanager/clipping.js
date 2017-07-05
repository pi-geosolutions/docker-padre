(function() {

  goog.provide('app.layerclipping');

  var module = angular.module('app.layerclipping', []);

  gn.layerclippingDirective = function() {
    return {
      restrict: 'E',
      scope: {
        map: '<appLayerclippingMap',
        layer: '<appLayerclippingLayer'
      },
      controller: 'AppLayerclippingController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '../../catalog/views/pigeo/js/layermanager/' +
      'clipping.html'
    };
  };

  module.directive('appLayerclipping', gn.layerclippingDirective);

  gn.LayerclippingController = function($scope) {
    this.curtainH = 1;
    this.curtainV = 1;

    this.layer.on('precompose', this.handlePreCompose_.bind(this));
    this.layer.on('postcompose', this.handlePostCompose_.bind(this));

    $scope.$watchGroup([
        function() { return this.curtainH}.bind(this),
        function() { return this.curtainV}.bind(this)
    ], function() {
      this.layer.changed();
    }.bind(this));
  };

  gn.LayerclippingController.prototype.handlePreCompose_ = function(evt) {
    if(this.curtainH == 1 && this.curtainV == 1) return;
    var ctx = evt.context;
    var width = ctx.canvas.width * this.curtainH;
    var height = ctx.canvas.height * this.curtainV;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.clip();
  };

  gn.LayerclippingController.prototype.handlePostCompose_ = function(evt) {
    evt.context.restore();
  };

  gn.LayerclippingController['$inject'] = [
      '$scope'
  ];

  module.controller('AppLayerclippingController', gn.LayerclippingController);


})();