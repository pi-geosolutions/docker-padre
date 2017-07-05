(function() {

  goog.provide('app.wmst.imageloader');

  var module = angular.module('app.wmst.imageloader', []);

  gn.AppWmstImageLoader = function() {
  };

  gn.AppWmstImageLoader.prototype.createStaticSource = function(layer, map) {
    var extent = layer.get('cextent');

    var size = [1514, 1265];

    return {
      size: map.getSize(),
      imageExtent: extent,
      projection: map.getView().getProjection()
    };

    //this.ngeoDecorateLayer(this.animLayer);
    //this.animLayer.displayInLayerManager = true;
    //this.animLayer.set('label', animation.label);
    //this.animLayer.set('_animation', true);

  };

  gn.AppWmstImageLoader['$inject'] = [
  ];

  module.service('wmstImageLoader', gn.AppWmstImageLoader);

})();
