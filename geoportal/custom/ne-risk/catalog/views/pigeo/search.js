(function() {

  goog.provide('gn_search_pigeo');

  goog.require('gn_search');
  goog.require('gn_search_pigeo_config');
  goog.require('gn_solr');
  goog.require('gn_featurestable');
  goog.require('app.bglayer');
  goog.require('app.catalog');
  goog.require('app.geocatalog');
  goog.require('app.layermanager');
  goog.require('app.adminunits');
  goog.require('app.mouseposition');
  goog.require('app.scaleselector');
  goog.require('app.animation');
  goog.require('app.query.polygon');
  goog.require('app.query.geodash');
  goog.require('app.measure');
  goog.require('app.auth');
  goog.require('app.wmst');
  goog.require('app.chartlayer.service');
  goog.require('app.mdactionsmenu');
  goog.require('app.kmz.overlay');
  goog.require('app.layerloader');
  goog.require('app.layerprocess');
  goog.require('app.legend');
  goog.require('app.catalog.recenter');


  var module = angular.module('gn_search_pigeo',[
    'gn_search',
    'gn_search_pigeo_config',
    'gn_solr', 'gn_featurestable',
    'app.bglayer',
    'app.catalog',
    'app.geocatalog',
    'app.layermanager',
    'app.mouseposition',
    'app.scaleselector',
    'app.animation',
    'app.adminunits',
    'app.measure',
    'app.query.polygon',
    'app.query.geodash',
    'app.auth',
    'app.wmst',
    'app.chartlayer.service',
    'app.mdactionsmenu',
    'app.kmz.overlay',
    'app.layerprocess',
    'app.layerloader',
    'app.catalog.recenter',
    'app.legend'
  ]);

  gn.MainController = function($scope, gnPopup, ngeoSyncArrays, gnMdView,
                               chartlayerService, gnViewerSettings,
                               appBboxLayer, ngeoDebounce, $location,
                               appLayerprocessService) {

    this.ui = gnViewerSettings.ui;
    this.$scope = $scope;
    this.appBboxLayer = appBboxLayer;
    this.ngeoDebounce = ngeoDebounce;
    this.$location = $location;
    this.appLayerprocessService = appLayerprocessService;

    this.setMap_();

    this['selectedLayers'] = [];
    this.manageSelectedLayers_($scope, ngeoSyncArrays);
    this.gnPopup = gnPopup;


    gnMdView.initFormatter('#map-container');

    this.markerStyle = new ol.style.Style({
      image: new ol.style.Icon({
        src: '../../catalog/views/pigeo/data/marker.png',
        anchorYUnits: 'pixels',
        anchor: [0.5, 50]
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(255,0,0,1)',
        width: 2
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.3)'
      })
    });

    this.queryLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      map: this.map,
      style: this.markerStyle
    });

    this.lang = $scope.lang;
    this.langs =  {eng: "en", fre: "fr"};

    // Hide Auth panel docuement click
    $(document).click(function(e){
      if(!$(e.target).hasClass('fa-user')) {
        $scope.$apply(function() {
          this.showAuth = false;
        }.bind(this));
      }
    }.bind(this));

    $('app-auth').click(function(e){
      e.stopPropagation();
    }.bind(this));


    this.initPermalink_();
    this.manageBBoxLayer_();

    chartlayerService.init(this.map);

/*
    $scope.$watch(function() {
      return appLayerprocessService.current;
    }, function(current) {
      if(current)
        this.layerProcess = current. layer;
    }.bind(this));
*/

  };

  gn.MainController.prototype.setMap_ = function() {

    this.map = new ol.Map({
      view: new ol.View({
        center: this.ui.map.center,
        zoom: this.ui.map.zoom
      }),
      controls: [
        new ol.control.Zoom({
          zoomInTipLabel: 'Zoom avant',
          zoomOutTipLabel: 'Zoom arrière'
        }),
        new ol.control.FullScreen({
          tipLabel: 'Plein écran',
          className: 'un-full-screen',
          label:$(
            '<span class="fa fa-arrows-alt"></span>').get(0)})
      ]
    });
  };

  gn.MainController.prototype.manageSelectedLayers_ =
    function(scope, ngeoSyncArrays) {
      var map = this.map;
      ngeoSyncArrays(map.getLayers().getArray(),
        this['selectedLayers'], true, scope,
        function(layer) {
          layer.changed();
          return layer.displayInLayerManager;
        }
      );
    };

  gn.MainController.prototype.initPermalink_ = function() {
    var view = this.map.getView();
    var updateUrl = true, updateView = true;

    // Check on page load if there is a permalink
    var viewP = this.$location.search();
    if(viewP.z) {
      updateUrl = false;
      view.setZoom(parseFloat(viewP.z));
    }
    if(viewP.x && viewP.y) {
      updateUrl = false;
      view.setCenter([parseFloat(viewP.x), parseFloat(viewP.y)]);
    }

    // Update $location on view change
    view.on('propertychange',
      this.ngeoDebounce(
        function(e) {
          if(updateUrl) {
            var center = view.getCenter();
            var params = {
              'z': view.getZoom(),
              'x': Math.round(center[0]),
              'y': Math.round(center[1])
            };
            updateView = false;
            this.$location.search(params);
          }
          else {
            updateUrl = true;
          }
        }.bind(this), 300, true));

    // update view on $location change
    this.$scope.$on('$locationChangeSuccess', function() {
      if(updateView) {
        var viewP = this.$location.search();
        updateUrl = false;
        if(viewP.z) {
          view.setZoom(parseFloat(viewP.z));
        }
        if(viewP.x && viewP.y) {
          view.setCenter([parseFloat(viewP.x), parseFloat(viewP.y)]);
        }
      }
      else {
        updateView = true;
      }
    }.bind(this));
  };

  gn.MainController.prototype.closeSidebar = function() {
    this.layersOpen = false;
    this.contextOpen = false;
    this.printOpen = false;
    this.animationOpen = false;
    this.drawOpen = false;
    this.importOpen = false;
    this.geocatalogOpen = false;
    this.polygonQueryOpen = false;
    this.geodashQueryOpen = false;
    this.wfsFilterOpen = false;
  };

  gn.MainController.prototype.manageBBoxLayer_ = function() {
    this.$scope.$watch(function() {
      return this.geocatalogOpen;
    }.bind(this), function(opened) {
      var layer = this.appBboxLayer.layer
      if(layer) {
        layer.setVisible(opened);
        layer.changed();
      }
    }.bind(this));
  };

  gn.MainController.prototype.sidebarOpen = function() {
    return this.layersOpen || this.contextOpen || this.printOpen ||
      this.drawOpen || this.importOpen || this.geocatalogOpen ||
      this.animationOpen || this.polygonQueryOpen || this.geodashQueryOpen || this.wfsFilterOpen;
  };

  gn.MainController.prototype.showTab = function(selector) {
    $(selector).tab('show');
  };

  gn.MainController.prototype.switchLang = function(code) {
    if(code !== this.lang) {
      var url = location.href.split('/');
      url[5] = code;
      location.href = url.join('/');
      if (moment) {
        moment.lang(this.langs[code]);
      }
    }
  };

  gn.MainController.prototype.zoomToExtent = function() {
    var map = this.map;
    map.getView().fit(this.ui.map.extent, map.getSize());
    this.$scope.$broadcast('mapfit');
  };

  module.controller('MainController', gn.MainController);
  gn.MainController['$inject'] = [
    '$scope',
    'gnPopup',
    'ngeoSyncArrays', 'gnMdView', 'chartlayerService', 'gnViewerSettings', 'appBboxLayer',
    'ngeoDebounce', '$location', 'appLayerprocessService'
  ];

})();
