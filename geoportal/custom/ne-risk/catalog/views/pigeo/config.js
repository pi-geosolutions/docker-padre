var gn = {};

if(!goog) {
  var goog = {};
  goog.UID_PROPERTY_ = 'closure_uid_406936994';
  goog.uidCounter_ = 0;
  goog.getUid = function(obj) {
    return obj[goog.UID_PROPERTY_] ||
        (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
  };
}

(function() {

  goog.provide('gn_search_pigeo_config');
  window.gn = {};
  var module = angular.module('gn_search_pigeo_config', []);

  module
      .run([
        'gnSearchSettings',
        'gnViewerSettings',
        function(searchSettings, viewerSettings) {

          // Load the context defined in the configuration
          viewerSettings.defaultContext = null;

          // Keep one layer in the background
          // while the context is not yet loaded.
          viewerSettings.bgLayers = [];

          viewerSettings.servicesUrl = {
            wms: [{
              name: 'Pigeo geoserver',
              url: 'http://gm-risk.pigeo.fr/geoserver-prod/ows'
            }, {
              name: 'Pigeo geoserver tests WMST',
              url: 'http://ne-risk.pigeo.fr/geoserver-prod/test_time/ows'
            }],
            wmts: [{
              name: 'Arcgisonline - Relief ombré',
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/WMTS/1.0.0/WMTSCapabilities.xml?REQUEST=GetCapabilities&service=WMTS'
            }, {
              name: 'Arcgisonline - World Imagery',
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml?REQUEST=GetCapabilities&service=WMTS'
            }]
          };

          var bboxStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'rgba(255,0,0,1)',
              width: 2
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255,0,0,0.3)'
            })
          });
          searchSettings.olStyles = {
            drawBbox: bboxStyle,
            mdExtent: new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: 'orange',
                width: 2
              })
            }),
            mdExtentHighlight: new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: 'orange',
                width: 3
              }),
              fill: new ol.style.Fill({
                color: 'rgba(255,255,0,0.3)'
              })
            })

          };

          searchSettings.hitsperpageValues = [20, 50, 100];
          searchSettings.paginationInfo = {
            hitsPerPage: searchSettings.hitsperpageValues[0]
          };
          searchSettings.sortbyValues = [{
            sortBy: 'relevance',
            sortOrder: ''
          }, {
            sortBy: 'changeDate',
            sortOrder: ''
          }, {
            sortBy: 'title',
            sortOrder: 'reverse'
          }, {
            sortBy: 'rating',
            sortOrder: ''
          }, {
            sortBy: 'popularity',
            sortOrder: ''
          }, {
            sortBy: 'denominatorDesc',
            sortOrder: ''
          }, {
            sortBy: 'denominatorAsc',
            sortOrder: 'reverse'
          }];

          /* Default search by option */
          searchSettings.sortbyDefault = searchSettings.sortbyValues[0];

          /* Custom templates for search result views */
          searchSettings.resultViewTpls = [{
            tplUrl: '../../catalog/views/pigeo/templates/grid.html',
            tooltip: 'Grid',
            icon: 'fa-th'
          }];

          searchSettings.formatter = {
            defaultUrl: {
              label: 'full',
              url : function(md) {
                return '../api/records/' + md.getUuid() + '/formatters/xsl-view?root=div&view=advanced';
              }
            }, //'md.format.xml?xsl=pigeo_simple_view&uuid=',
            list: [{
              label: 'full',
              url : function(md) {
                return '../api/records/' + md.getUuid() + '/formatters/xsl-view?root=div&view=advanced';
              }
            }]
          };

          // Set the default template to use
          searchSettings.resultTemplate =
              searchSettings.resultViewTpls[0].tplUrl;

          viewerSettings.contexts = ['france', 'italy', 'gb'];

          /** Facets configuration */
          searchSettings.facetsSummaryType = 'details';

          viewerSettings.bingKey = 'AnElW2Zqi4fI-9cYx1LHiQfokQ9GrNzcjOh_' +
              'p_0hkO1yo78ba8zTLARcLBIf8H6D';

          viewerSettings.singleTileWMS = false;

          viewerSettings.geodashUrl = 'http://dev.padre2.pigeo.fr/geodash/' +
              'dashboard/public/index.html?'


        }]);
})();
