(function() {

  goog.provide('app.legend');

  goog.require('gn_legendpanel_directive');

  var module = angular.module('app.legend', ['gn_legendpanel_directive']);


  var allLegendsDirective = function(legendService) {
    return {
      restrict: 'A',
      scope: {
        map: '<appAlllegendsMap'
      },
      link: function(scope, element, attr) {
        element.on('click', function() {
          legendService.openAllInPopup(scope, scope.map);
        });
      }
    };
  };

  module.directive('appAlllegends', allLegendsDirective);

  allLegendsDirective['$inject'] = [
    'AppLegendService'
  ];

  module.controller('AppAuthController', gn.AuthController);


  var legendService = function(gnPopup, $translate) {
    this.gnPopup = gnPopup;
    this.$translate = $translate;
  };

  legendService.prototype.openAllInPopup = function(scope, map) {

    var newScope = scope.$new();
    newScope.map = map;
    if($('.app-legendpanel').length > 0) return;
    this.gnPopup.create({
      title: this.$translate.instant('legends'),
      content: '<div gn-legend-panel="::map" class="info-content"/>',
      className: 'app-popup app-legendpanel'
    }, newScope);
  };

  module.service('AppLegendService', legendService);

  legendService['$inject'] = [
    'gnPopup', '$translate'
  ];

})();