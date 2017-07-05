(function() {

  goog.provide('app.animation');
  goog.require('app.animator');

  var module = angular.module('app.animation', ['app.animator']);

  var URL_CONFIG = 'pigeo.animations.list?_content_type=json';
  var URL_LIST = 'pigeo.animations.listfiles';
  var URL_IMAGE = 'pigeo.animations.getimage';

  gn.animationDirective = function() {
    return {
      restrict: 'E',
      scope: {
        map: '=appAnimationMap'
      },
      controller: 'AppAnimationController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '../../catalog/views/pigeo/js/animation/animation.html'
    };
  };
  module.directive('appAnimation', gn.animationDirective);

  gn.AnimationController = function($http, $scope, ngeoDecorateLayer, $interval) {

    this.$http = $http;
    this.ngeoDecorateLayer = ngeoDecorateLayer;
    this.mapProj_ = this.map.getView().getProjection();

    $scope.$watch(function() {
      return this.animation;
    }.bind(this), function(animation) {
      if(animation) {
        this.getFilesList();
      }
      else {
        delete this.filesList;
      }
    }.bind(this));

    $http.get(URL_CONFIG).then(function(response) {
      this.animations = response.data[0];
      //this.animation = this.animations.length && this.animations[0]
    }.bind(this));

    this.map.getLayers().on('remove', function(e) {
      if(e.element.get('_animation')) {
        this.animation = null;
      }
    }.bind(this));

    $interval(function() {
      if(this.animation) {
        this.getFilesList(true);
      }
    }.bind(this), 1000*60*5);
  };

  gn.AnimationController.prototype.getFilesList = function(refresh) {
    this.$http.get(URL_LIST, {
      params: {
        dataName: this.animation.id
      }
    }).then(function(response) {
      this.filesList = response.data;
      if(!refresh) {
        this.storeLayerInfo_(this.animation, this.filesList);
      }
    }.bind(this));
  };

  gn.AnimationController.prototype.storeLayerInfo_ = function(animation, list) {
    var bbox = animation.geographicbounds;
    var imagesize = animation.imagesize;
    var extent = ol.proj.transformExtent([
          parseFloat(bbox.minlon),
          parseFloat(bbox.minlat),
          parseFloat(bbox.maxlon),
          parseFloat(bbox.maxlat)],
        animation.SRS, this.mapProj_);
    var size = [parseInt(imagesize.width), parseInt(imagesize.height)];

    this.sourceConfig = {
      size: size,
      imageExtent: extent,
      projection: this.mapProj_
    };
    this.animLayer = new ol.layer.Image();
    this.map.addLayer(this.animLayer);

    this.ngeoDecorateLayer(this.animLayer);
    this.animLayer.displayInLayerManager = true;
    this.animLayer.set('label', animation.label);
    this.animLayer.set('_animation', true);
  };

  gn.AnimationController.prototype.onAnimatorChange = function(index) {
    this.sourceConfig.url = URL_IMAGE + '?path=' + this.filesList.path + '&fname=' +
        this.filesList.files[index];

    this.animLayer.setSource(new ol.source.ImageStatic(this.sourceConfig));

    //TODO wait for resfresh function
    // this.animLayer.getSource().refresh();
  };

  module.controller('AppAnimationController',
      gn.AnimationController);

  gn.AnimationController['$inject'] = [
    '$http', '$scope', 'ngeoDecorateLayer', '$interval'
  ];

})();