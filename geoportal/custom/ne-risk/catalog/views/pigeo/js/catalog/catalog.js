(function() {

  goog.provide('app.catalog');

  var PIGEO_GEOSERVER_URL = 'http://ne-risk.pigeosolutions.fr/geoserver/wms';

  var module = angular.module('app.catalog', []);
  //module.constant('appCatalogUrl', '../../catalog/views/pigeo/data/senegaltree.json');
  module.constant('appCatalogUrl', 'pigeo.layertree.get');

  module.value('ngeoLayertreeTemplateUrl',
    '../../catalog/views/pigeo/js/catalog/layertree.html');

  gn.catalogDirective = function() {
    return {
      restrict: 'E',
      scope: {
        'map': '=appCatalogMap'
      },
      controller: 'AppCatalogController',
      controllerAs: 'catalogCtrl',
      bindToController: true,
      template: '<div ngeo-layertree="::catalogCtrl.tree" ' +
      'ngeo-layertree-map="catalogCtrl.map" ' +
      'ngeo-layertree-nodelayer="catalogCtrl.getLayer(node)" ' +
      'class="themes-switcher collapse in"></div>'
    };
  };
  module.directive('appCatalog', gn.catalogDirective);

  var layerCache_ = {};
  gn.AppCatalogController =
    function($http, appCatalogUrl, gnMap, $scope,
             gnOwsCapabilities, ngeoDecorateLayer) {

      this.gnMap_ = gnMap;
      this.ngeoDecorateLayer = ngeoDecorateLayer;
      this.gnOwsCapabilities = gnOwsCapabilities;

      $http.get(appCatalogUrl).then(function(catalog) {
        this.tree = catalog.data;
        this.updateLayersFromCap();

        // Apply text filter on the tree
        $scope.$watch(function() {
          return this.activeFilter;
        }.bind(this), function(filter) {
          if(angular.isDefined(filter)) {
            this.clearFilterNode_(this.tree);
            this.filterNode_(this.tree, filter);
          }
        }.bind(this));
      }.bind(this));
    };

  /**
   * Traverse tree and disable filter.
   * Mark all nodes as visible.
   * @param {TreeNode} node Node to traverse.
   * @private
   */
  gn.AppCatalogController.prototype.clearFilterNode_ = function(node) {
    delete node._matchFilter;
    if(node.children) {
      node.children.forEach(function(child) {
        this.clearFilterNode_(child);
      }.bind(this));
    }
  };

  /**
   * Filter a tree structure. Match filter text and `node.text` property.
   * All node that match are marked with `node._matchFilter = true`.
   * If a node match, then all children are visible.
   *
   * @param {TreeNode} node Node to traverse.
   * @param {string} text Filter text.
   * @returns {boolean}
   * @private
   */
  gn.AppCatalogController.prototype.filterNode_ = function(node, text) {
    var match = false;
    if(node.text && node.text.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
      match = true;
    }
    else {
      if(node.children) {
        node.children.forEach(function(child) {
          match = (this.filterNode_(child, text) || match);
        }.bind(this));
      }
    }
    node._matchFilter = match;
    return match;
  };

  gn.AppCatalogController.prototype.toggle = function(node) {
    var layer = this.getLayer(node);
    var map = this['map'];
    if (map.getLayers().getArray().indexOf(layer) >= 0) {
      map.removeLayer(layer);
    } else {
      map.addLayer(layer);
    }
  };

  gn.AppCatalogController.prototype.toggleNode = function(ctrl, evt) {
    evt.preventDefault();
    if(ctrl.node.children && ctrl.depth > 1) {
      var el = $(evt.target);
      if(el.is('i')) {
        el = el.parent();
      }
      el.find('.fa').first().toggleClass('fa-minus-square')
        .toggleClass('fa-plus-square');
    }
  };

  gn.AppCatalogController.prototype.getLayer = function(node) {
    var layer, layerCacheKey;
    var type = node.type;
    if (type == 'folder') {
      return null;
    }

    layerCacheKey = type + '_' + node['layers'];
    if (layerCacheKey in layerCache_) {
      return layerCache_[layerCacheKey];
    }

    var layer;

    // Create a wms layer
    if(type == 'wms') {
      var layerOpts = {
        label: node.text,
        url: node.url,
        metadata: node.metadataUrl
      };
      if(angular.isDefined(node.TILED)) {
        layerOpts.tiled = node.TILED;
      }
      layer = this.gnMap_.createOlWMS(this.map,
        {'LAYERS': node.layers}, layerOpts);
    }

    else if (type == 'chart') {
      layer = new ol.layer.Image({
        label: node.text,
        layers: node.layers
      });
      this.ngeoDecorateLayer(layer);
      layer.displayInLayerManager = true;

      layer.set('chartconfig', {
        changescales: node.changescales,
        layers: node.layers,
        chartsize: node.chartsize,
        charttype: node.charttype,
        colorcodes: node.colorcodes,
        dbname: node.dbname,
        dbtables: node.dbtables,
        dbwhere: node.dbwhere,
        format: node.format,
        join_dbfield: node.join_dbfield,
        join_geofield: node.join_geofield,
        labels_dbfield: node.labels_dbfield,
        values_dbfield: node.values_dbfield
      });
    }
    layer.set('metadataUuid', node.uuid);
    layer.set('queryable', node.queryable);
    if(node.pq_rastertype_fields) {
      layer.set('queryablepolygon', {
        pq_bandnb: node.pq_bandnb,
        pq_header: node.pq_header,
        pq_layer: node.pq_layer,
        pq_rastertype_fields: node.pq_rastertype_fields,
        pq_round: node.pq_round
      });

    }

    this.gnMap_.feedLayerMd(layer);

    layerCache_[layerCacheKey] = layer;

    return layer;
  };

  /**
   * Do one capabilities for all pigeo layers, then fetch layers info
   * depending on layer name and if belongs to a workspace or not.
   */
  gn.AppCatalogController.prototype.updateLayersFromCap = function() {

    this.gnOwsCapabilities.getWMSCapabilities(PIGEO_GEOSERVER_URL).then(
      function(capObj) {
        for(var p in layerCache_) {
          var l = layerCache_[p],
              layers = l.getSource().getParams().LAYERS,
              url = l.get('url'),
              capL;

          // Layers configured to main geoserver, layername contains workspace
          if(url.indexOf('http://ne-risk.pigeosolutions.fr/geoserver/wms') >= 0 ||
            url.indexOf('http://ne-risk.pigeosolutions.fr/geoserver/ows') >= 0) {
            capL = this.gnOwsCapabilities.getLayerInfoFromCap(layers, capObj);
          }
          else if(url.indexOf('http://ne-risk.pigeosolutions.fr/geoserver/') >= 0) {
            if(layers.indexOf(':') > 0) {
              capL = this.gnOwsCapabilities.getLayerInfoFromCap(layers, capObj);
            }
            else {
              var r = layers.match(/geoserver\/(.*)\//);
              if(r && r.length == 2) {
                // TODO can layers have multiple ?
                capL = this.gnOwsCapabilities.getLayerInfoFromCap(
                  r[1] + ':' + layers, capObj);
              }
            }
          }

          if(capL) {
            var tmpLayer = this.gnMap_.createOlWMSFromCap(this.map, capL, url);
            for(var prop in tmpLayer.getProperties()) {
              if(!l.get(prop) && tmpLayer.get(prop)) {
                l.set(prop, tmpLayer.get(prop));
              }
            }
            if(tmpLayer.get('time')) {
              console.log(tmpLayer.get('time'));
            }
          }
        }
      }.bind(this));

    this.gnOwsCapabilities.getWMSCapabilities('http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi?').then(
      function(capObj) {
        for(var p in layerCache_) {
          var l = layerCache_[p],
            layers = l.getSource().getParams().LAYERS,
            url = l.get('url'),
            capL;

            capL = this.gnOwsCapabilities.getLayerInfoFromCap(layers, capObj);

          if(capL) {
            var tmpLayer = this.gnMap_.createOlWMSFromCap(this.map, capL, url);
            for(var prop in tmpLayer.getProperties()) {
              if(!l.get(prop) && tmpLayer.get(prop)) {
                l.set(prop, tmpLayer.get(prop));
              }
            }
            if(tmpLayer.get('time')) {
              console.log(tmpLayer.get('time'));
            }
          }
        }
      }.bind(this));

  };

  module.controller('AppCatalogController',
    gn.AppCatalogController);

  gn.AppCatalogController['$inject'] = [
    '$http',
    'appCatalogUrl',
    'gnMap',
    '$scope',
    'gnOwsCapabilities',
    'ngeoDecorateLayer'
  ];

})();
