(function() {

  goog.provide('app.kmz.overlay');

  var module = angular.module('app.kmz.overlay', []);
  
  gn.KmlOverlay = function() {
    return {
      restrict: 'E',
      scope: {
        map: '<appKmlOverlayMap'
      },
      controller: 'AppKmlOverlayController',
      controllerAs: 'ctrl',
      bindToController: true
    };
  };

  module.directive('appKmlOverlay', gn.KmlOverlay);

  gn.KmlOverlayController = function($timeout) {

    var map = this.map;

    var hasKml = false;
    map.getLayers().on('change:length', function() {
      hasKml = this.map.getLayers().getArray().some(function(layer) {
        return layer.get('kml');
      }.bind(this));
    }.bind(this));

    // Display pop up on feature over
    var div = document.createElement('div');
    div.className = 'overlay';
    var overlay = new ol.Overlay({
      element: div,
      positioning: 'bottom-left'
    });
    map.addOverlay(overlay);

    var hidetimer;
    var hovering = false;
    $(map.getViewport()).on('mousemove', function(e) {
      if (hovering) { return; }
      if(!hasKml) return;
      var f;
      var pixel = map.getEventPixel(e.originalEvent);
      var coordinate = map.getEventCoordinate(e.originalEvent);
      map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (!layer || !layer.get('getinfo')) { return; }
        $timeout.cancel(hidetimer);
        if (f != feature) {
          f = feature;
          var html = '';
          if (feature.getKeys().indexOf('description') >= 0) {
            html = feature.get('description');
          } else {
            $.each(feature.getKeys(), function(i, key) {
              if (key == feature.getGeometryName() || key == 'styleUrl') {
                return;
              }
              html += '<dt>' + key + '</dt>';
              html += '<dd>' + feature.get(key) + '</dd>';
            });
            html = '<dl class="dl-horizontal">' + html + '</dl>';
          }
          overlay.getElement().innerHTML = html;
        }
        overlay.setPosition(coordinate);
        $(overlay.getElement()).show();
      }, this, function(layer) {
        return !layer.get('temporary');
      });
      if (!f) {
        hidetimer = $timeout(function() {
          $(div).hide();
        }, 200, false);
      }
    });
    $(div).on('mouseover', function() {
      hovering = true;
    });
    $(div).on('mouseleave', function() {
      hovering = false;
    });

  };

  gn.KmlOverlayController['$inject'] = [
    '$timeout'
  ];

  module.controller('AppKmlOverlayController', gn.KmlOverlayController);

})();