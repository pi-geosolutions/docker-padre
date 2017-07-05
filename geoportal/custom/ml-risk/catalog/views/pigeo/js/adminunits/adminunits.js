(function() {

  goog.provide('app.adminunits');

  var module = angular.module('app.adminunits', []);

  var serviceUrl = 'http://ml-risk.pigeosolutions.fr/sigdt-config/services-mali/';

  var getNodeText = function(htmlParentNode, nodeName) {
    var parent = $(htmlParentNode);
    return $(parent.find(nodeName)).text();
  };

  gn.adminunitsDirective = function() {
    return {
      restrict: 'E',
      scope: {
        'map': '=appAdminUnitsMap'
      },
      controllerAs: 'ctrl',
      bindToController: true,
      controller: 'AppAdminunitsController'
    };
  };
  module.directive('appAdminUnits', gn.adminunitsDirective);


  gn.AdminunitsController = function($http, $q, gnGlobalSettings, gnViewerSettings) {

    var loc = {};
    var promises = [];
    var adminUnitsNames = ['Regions', 'Cercles', 'Communes'];
    //serviceUrl = gnViewerSettings.ui.auService;

    adminUnitsNames.forEach(function(adminType, lvl) {
      var url = serviceUrl + 'get' + adminType + '.php';
      var proxyUrl = gnGlobalSettings.proxyUrl + encodeURIComponent(url);
      promises.push($http.get(proxyUrl).then(function(response) {
        var doc = ol.xml.parse(response.data);
        var nodes = doc.getElementsByTagName('emprise');
        var values = [];
        for(var i = 0; i < nodes.length ; i ++) {
          var node = nodes.item(i);
          values.push({
            name: getNodeText(node, 'nom'),
            up: getNodeText(node, 'up'),
            up1: getNodeText(node, 'up1'),
            up2: getNodeText(node, 'up2'),
            id: node.getAttribute('id'),
            lvl: lvl,
            extent: ol.proj.transformExtent([
              parseFloat(getNodeText(node, 'xUL')),
              parseFloat(getNodeText(node, 'yLR')),
              parseFloat(getNodeText(node, 'xLR')),
              parseFloat(getNodeText(node, 'yUL'))
            ], 'EPSG:4326', this.map.getView().getProjection())
          });
        }
        loc[adminType] = values;
      }.bind(this)));
    }.bind(this));

    gnViewerSettings.adminunitsPromise = $q.all(promises);
    gnViewerSettings.adminunits = loc;
  };

  module.controller('AppAdminunitsController',
      gn.AdminunitsController);

  gn.AdminunitsController['$inject'] = [
    '$http', '$q', 'gnGlobalSettings',
    'gnViewerSettings'
  ];

})();
