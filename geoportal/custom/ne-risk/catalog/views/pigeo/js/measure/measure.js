(function() {

  goog.provide('app.measure');

  var module = angular.module('app.measure', []);

  var WPS_SERVER_URL = 'http://ne-risk.pigeosolutions.fr/geoserver/wps';

  gn.measureToolsDirective = function() {
    return {
      restrict: 'E',
      scope: {
        map: '<appMeasureToolsMap',
        active: '=appMeasureToolsActive'
      },
      controller: 'AppMeasureController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '../../catalog/views/pigeo/js/measure/measure.html'
    };
  };

  module.directive('appMeasureTools', gn.measureToolsDirective);

  gn.MeasureController = function($sce, $scope, $translate, $compile,
                                  ngeoDecorateInteraction, $filter) {

    this.measureStartMsg = $sce.trustAsHtml($translate.instant('measureStart'));
    this.measureLengthContinueMsg = $sce.trustAsHtml($translate.instant('measureLengthContinue'));
    this.measureAreaContinueMsg = $sce.trustAsHtml($translate.instant('measureAreaContinue'));
    this.measureAzimutContinueMsg = $sce.trustAsHtml($translate.instant('measureZimutContinue'));

    // Create elements for the measure tools' tooltips.
    var measureStartMsg = angular.element(
        '<span ng-bind-html="ctrl.measureStartMsg"></span>');
    measureStartMsg = $compile(measureStartMsg)($scope);
    var measureLengthContinueMsg = angular.element(
        '<span ng-bind-html="ctrl.measureLengthContinueMsg"></span>');
    measureLengthContinueMsg = $compile(measureLengthContinueMsg)($scope);
    var measureAreaContinueMsg = angular.element(
        '<span ng-bind-html="ctrl.measureAreaContinueMsg"></span>');
    measureAreaContinueMsg = $compile(measureAreaContinueMsg)($scope);
    var measureAzimutContinueMsg = angular.element(
        '<span ng-bind-html="ctrl.measureAzimutContinueMsg"></span>');
    measureAzimutContinueMsg = $compile(measureAzimutContinueMsg)($scope);

    var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    });

    var map = this.map;

    this.measureLength = new ngeo.interaction.MeasureLength($filter('ngeoUnitPrefix'), {
      sketchStyle: style,
      startMsg: measureStartMsg[0],
      continueMsg: measureLengthContinueMsg[0]
    });

    var measureLength = this.measureLength;
    measureLength.setActive(false);
    ngeoDecorateInteraction(measureLength);
    map.addInteraction(measureLength);

    this.measureArea = new ngeo.interaction.MeasureArea($filter('ngeoUnitPrefix'), {
      sketchStyle: style,
      startMsg: measureStartMsg[0],
      continueMsg: measureAreaContinueMsg[0]
    });

    var measureArea = this.measureArea;
    measureArea.setActive(false);
    ngeoDecorateInteraction(measureArea);
    map.addInteraction(measureArea);

    this.measureAzimut = new ngeo.interaction.MeasureAzimut($filter('ngeoUnitPrefix'), {
      sketchStyle: style,
      startMsg: measureStartMsg[0],
      continueMsg: measureAzimutContinueMsg[0]
    });

    var measureAzimut = this.measureAzimut;
    measureAzimut.setActive(false);
    ngeoDecorateInteraction(measureAzimut);
    map.addInteraction(measureAzimut);

    $scope.$watch(function() {
      return this.active;
    }.bind(this), function(active) {
      if(active === false) {
        this.measureAzimut.setActive(false);
        this.measureArea.setActive(false);
        this.measureLength.setActive(false);
      }
    }.bind(this));
  };


  gn.MeasureController['$inject'] = [
    '$sce', '$scope', '$translate', '$compile', 'ngeoDecorateInteraction', '$filter'
  ];

  module.controller('AppMeasureController', gn.MeasureController);

})();
