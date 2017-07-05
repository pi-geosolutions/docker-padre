(function() {

  goog.provide('app.temporalfiles');
  goog.require('app.temporalfiles.service');

  var module = angular.module('app.temporalfiles', ['app.temporalfiles.service']);

  var config = {
    ndvi: {
      years: ['1998', '1999', '2000', '2001','2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009','2010', '2011', '2012']
    },
    moisture: {
      years: ['1998', '1999', '2000', '2001','2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009','2010', '2011']
    },
    vci: {
      years: ['1998', '1999', '2000', '2001','2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009','2010', '2011']
    }
  };

  gn.temporalDirective = function() {
    return {
      restrict: 'E',
      scope: {
        coords: '=appTemporalFilesCoords'
      },
      controller: 'AppTemporalFilesController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '../../catalog/views/pigeo/js/temporal/' +
      'temporal.html'
    };
  };

  module.directive('appTemporalFiles', gn.temporalDirective);

  gn.TemporalFilesController = function($http, temporalService) {
    this.types = Object.keys(config);
    this.config = config;
    this.level = 0;
    this.choice = [];
    this.$http = $http;
    this.temporalService = temporalService;
  };

  gn.TemporalFilesController.prototype.choose = function(level, what) {
    this.level = level;
    this.choice[level-1] = what;
  };

  gn.TemporalFilesController.prototype.back = function() {
    this.level --;
  };

  gn.TemporalFilesController.prototype.processAnnual = function(type, year) {
    var url = 'pigeo.ndvi.getvalues';
    this.$http.get(url, {
      params: {
        data: type,
        year: year,
        lon: this.coords[0],
        lat: this.coords[1],
        mode: 'yearByMonths'
      }
    });

    this.temporalService.getChart('../../catalog/views/pigeo/data/chart.tsv',
        'temporalChart');
  };

  gn.TemporalFilesController['$inject'] = [
      '$http', 'temporalService'
  ];

  module.controller('AppTemporalFilesController', gn.TemporalFilesController);

})();