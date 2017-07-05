(function() {

  goog.provide('app.mouseposition');
  var module = angular.module('app.mouseposition', []);

  proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
  proj4.defs('EPSG:32634', '+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');

  gn.mousepositionDirective = function($translate) {
    return {
      restrict: 'E',
      scope: {
        'map': '='
      },
      templateUrl: '../../catalog/views/pigeo/js/infobar/' +
          'mouseposition.html',
      link: function(scope, element, attrs) {
        var map = scope.map;

        var control = new ol.control.MousePosition({
          target: $('#mouseposition')[0],
          undefinedHTML: '&nbsp;'
        });
        map.addControl(control);

        var coordinatesFormat = function(c) {
          return c.map(function(i) { return i.toFixed(3) });
        };
        var coordinatesFormatUTM = function(coordinates, zone) {
          var coord = ol.coordinate.toStringXY(coordinates, 0).
              replace(/\B(?=(\d{3})+(?!\d))/g, "'");
          return coord + ' ' + zone;
        };

        scope.mousePositionProjections = [{
          value: 'EPSG:3857',
          label: 'Mercator Spheric',
          format: coordinatesFormat
        }, {
          value: 'EPSG:4326',
          label: 'WGS 84 (lat/lon)',
          format: function(coordinates) {
            return ol.coordinate.toStringHDMS(coordinates) +
                ' (' + ol.coordinate.format(coordinates, '{y}, {x}', 5) + ')';
          }
        }, {
          value: 'EPSG:4326',
          label: 'UTM',
          format: function(coordinates) {
            if (coordinates[0] > 14 && coordinates[0] < 20) {
              var utm_33n = ol.proj.transform(coordinates,
                  'EPSG:4326', 'EPSG:32633');
              return coordinatesFormatUTM(utm_33n, '(zone 33N)');
            } else if (coordinates[0] < 25 && coordinates[0] >= 20) {
              var utm_34n = ol.proj.transform(coordinates,
                  'EPSG:4326', 'EPSG:32634');
              return coordinatesFormatUTM(utm_34n, '(zone 34N)');
            } else {
              return '-';
            }
          }
        }];

        scope.changeProj = function(projection) {
          scope.projection = projection;
          control.setProjection(ol.proj.get(projection.value));
          control.setCoordinateFormat(projection.format);

        };
        scope.changeProj(scope.mousePositionProjections[1]);
      }
    };
  };
  module.directive('appMouseposition', ['$translate',
    gn.mousepositionDirective]);

})();
