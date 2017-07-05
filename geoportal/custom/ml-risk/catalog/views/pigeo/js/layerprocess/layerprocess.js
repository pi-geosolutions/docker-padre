(function() {

  goog.provide('app.layerprocess');

  var module = angular.module('app.layerprocess', []);


  gn.layerprocessDirective = function() {
    return {
      restrict: 'E',
      scope: {
        map: '<appLayerprocessMap',
        layer: '<appLayerprocessLayer'
      },
      controller: 'AppLayerprocessController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '../../catalog/views/pigeo/js/layerprocess/layerprocess.html'
    };
  };

  module.directive('appLayerprocess', gn.layerprocessDirective);

  gn.Layerprocess = function($scope, appLayerprocessService) {
    this.processes = [];
    this.expanded = false;
    this.service = appLayerprocessService;

    this.map.getLayers().on('remove', function(e) {
      if (e.element.get('wfsfilter-el')) {
        e.element.get('wfsfilter-el').remove();
      }
      if (e.element.get('wmst-el')) {
        e.element.get('wmst-el').remove();
      }
    });
  };

  gn.Layerprocess.prototype.close = function() {
    this.service.remove();
  };

  gn.Layerprocess['$inject'] = [
    '$scope',
    'appLayerprocessService'
  ];

  module.controller('AppLayerprocessController', gn.Layerprocess);

  /**
   * Layer process service.
   * Provides tools to manage the processes of a layer
   * (time, elevation, ncWms, wfsfilter, wps ...)
   * @constructor
   */
  gn.LayerprocessService = function($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.$compile = $compile;
    this.processes = [];
    this.current = null;
  };

  gn.LayerprocessService.prototype.addProcess = function(layer, type, map) {
    this.processes.push(layer);

    var element = $('.layerprocess-panel');
    element.children().each(function () {
      $(this).detach();
    });

    this.current = {
      layer: layer,
      type: type
    };

    var pEl = layer.get(type +'-el');
    if(pEl) {
      element.append(pEl);
      return;
    }

    var key = type + '_' + goog.getUid(layer);


    if(this.processes.hasOwnProperty(key)) {
      element.append(this.processes[key].el);
      return;
    }

    var el;
    if(type == 'wfsfilter') {
      el = this.setWfsFilter(layer, map);
    }
    if(type == 'wmst') {
      el = this.setWmst(layer, map);
    }
    this.processes[key] = {
      layer: layer,
      type: type,
      el: el
    }
  };
  gn.LayerprocessService.prototype.remove = function() {
    this.current = null;
  };

  gn.LayerprocessService.prototype.setWmst = function(layer, map) {

    if (!layer.get('wmst-el')) {
      var scope = this.$rootScope.$new();
      scope.layer = layer;
      scope.map = map;

      var el = angular.element(
        '<app-timeslider ng-show="layer.visible" ' +
        '   app-timeslider-map="map"' +
        '   app-timeslider-layer="layer">' +
        '</app-timeslider>'
      );
      this.$compile(el)(scope);
      var element = $('.layerprocess-panel');
      element.append(el);
      layer.set('wmst-el', el);
    }
  };

  gn.LayerprocessService.prototype.setWfsFilter = function(layer, map) {

    if (!layer.get('wfsfilter-el')) {
      var scope = this.$rootScope.$new();
      scope.layer = layer;
      scope.map = map;

      var el = angular.element(
        '<div ng-show="layer.visible" ' +
        '   data-gn-wfs-filter-facets="" ' +
        '   data-layer="layer" ' +
        '   data-wfs-url="' + layer.get('url').replace('wms?', 'wfs?') + '" ' +
        '   data-feature-type-name="' + layer.getSource().getParams().LAYERS + '">' +
        '</div>'
      );
      this.$compile(el)(scope);
      var element = $('.layerprocess-panel');
      element.append(el);
      layer.set('wfsfilter-el', el);
    }
  };


  gn.LayerprocessService['$inject'] = [
    '$rootScope',
    '$compile'
  ];

  module.service('appLayerprocessService', gn.LayerprocessService);

})();
