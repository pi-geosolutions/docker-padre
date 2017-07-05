(function() {

  goog.provide('app.wmst');
  goog.require('app.wmst.imageloader');

  var module = angular.module('app.wmst', ['app.wmst.imageloader']);


  /**
   * Directive
   *
   */
  gn.timesliderDirective = function() {
    return {
      restrict: 'E',
      scope: {
        layer: '<appTimesliderLayer',
        map: '<appTimesliderMap'
      },
      controller: 'AppTimesliderController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '../../catalog/views/pigeo/js/wmst/slider.html'
    };
  };

  module.directive('appTimeslider', gn.timesliderDirective);

  /**
   * Controller
   * @constructor
   */
  gn.TimesliderController = function($scope, wmstService, wmstImageLoader,
                                     gnUrlUtils) {
    this.$scope = $scope;
    this.wmstImageLoader = wmstImageLoader;
    this.gnUrlUtils = gnUrlUtils;

    this.loader = {
      loaded: false,
      images: [],
      ratio: 1,
      loading: false
    };

    this.wmsSource = this.layer.getSource();
    var timeP = wmstService.parseCap(this.layer);

    if(timeP.start) {
      this.type = 'interval';
      this.startUTC = getUTCDate(timeP.start);
      this.endUTC = getUTCDate(timeP.end);
      this.stepMs = timeP.step.as('milliseconds');
      this.dates = wmstService.getAllDatesAsIso(timeP.start, timeP.end, timeP.step);
    }
    else if (timeP.list) {
      this.type = 'list';
      this.dates = timeP.list;
    }

    $scope.$watch(function() {
      return this.curDateUTC;
    }.bind(this), function(date) {
      if(date) {
        this.onDateChange(date);
      }
    }.bind(this));

  };

  gn.TimesliderController.prototype.onDateChange = function(date) {
    this.curDateIso = new Date(parseInt(date)).toISOString();
    this.layer.getSource().updateParams({
      TIME:  this.curDateIso
    });
  };

  gn.TimesliderController.prototype.onAnimatorChange = function(index) {
    var dateISO = this.dates[index];
    if(this.loader.loaded) {
      this.layer.setSource(new ol.source.ImageStatic(this.loader.images[index]));
    }
    else {
      this.layer.getSource().updateParams({
        TIME:  dateISO
      });
    }
  };

  gn.TimesliderController.prototype.loadImages = function() {

    var map  = this.map,
      loader = this.loader,
      loadCounter = this.dates.length,
      extent = map.getView().calculateExtent(map.getSize()),
      url;

    loader.loaded = false;
    loader.progress = 0;
    loader.images = [];
    loader.loading = true;

    // Get current WMS image URL
    var image = this.wmsSource.getImage(
      extent,
      map.getView().getResolution(),
      1,
      map.getView().getProjection()
    );
    url = image.src_;

    var urlA = image.src_.split('?');
    var params = this.gnUrlUtils.parseKeyValue(urlA[1]);

    // The extent is extended by the gutter
    extent = params.BBOX.split(',').map(function(c) {
      return parseFloat(c);
    });

    delete params.TIME;
    angular.merge(params, {
      WIDTH: Math.round(params.WIDTH / loader.ratio),
      HEIGHT: Math.round(params.HEIGHT / loader.ratio)
    });

    url = this.gnUrlUtils.append(urlA[0],
         this.gnUrlUtils.toKeyValue(params));

    this.dates.forEach(function(d) {

      getDataUri(url + '&TIME=' + d, function(dataUri) {
        var sourceConfig = {
          url: dataUri,
          imageExtent: extent,
          projection: this.map.getView().getProjection()
        };
        loader.images.push(sourceConfig);

        this.$scope.$apply(function() {
          loadCounter--;
          this.loader.progress =
            (this.dates.length - loadCounter) * 100 / this.dates.length;
          if(loadCounter <= 0) {
            loader.loaded = true;
            loader.loading = false;
          }
        }.bind(this));
      }.bind(this));
    }.bind(this));
  };

  gn.TimesliderController['$inject'] = [
    '$scope',
    'wmstService',
    'wmstImageLoader',
    'gnUrlUtils'
  ];

  module.controller('AppTimesliderController', gn.TimesliderController);


  var ISO_DURATION_REGEX = /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/;
  var getDuration = function(pattern) {
    var matches = pattern.match(ISO_DURATION_REGEX);
    return moment.duration({
      years: parseFloat(matches[3]),
      months: parseFloat(matches[5]),
      weeks: parseFloat(matches[7]),
      days: parseFloat(matches[9]),
      hours: parseFloat(matches[12]),
      minutes: parseFloat(matches[14]),
      seconds: parseFloat(matches[16])
    });
  };

  var getUTCDate = function(date) {
    return Date.UTC(
      date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  };

  /**
   * Service
   * @param $timeout
   * @constructor
   */
  gn.AppWmstService = function($timeout) {
  };


  gn.AppWmstService.prototype.parseCap = function(layer) {

    var timeSpec = layer.get('time');

    // list
    if(timeSpec.length > 1 || timeSpec[0].indexOf('/') < 0) {
      return {
        list: timeSpec
      };
    }

    // intervals
    timeSpec = timeSpec[0];
    if(timeSpec.indexOf('/') > 0) {
      var seq = timeSpec.split('/'),
        initDate, endDate, step;

      if(seq.length > 1) {
        initDate = new Date(seq[0]);
        endDate = new Date(seq[1]);
      }
      if(seq.length > 2) {
        step = getDuration(seq[2]);
      }
      return {
        start: initDate,
        end: endDate,
        step: step
      };
    }
  };

  gn.AppWmstService.prototype.getAllDatesAsIso = function(start, end, step) {
    var startUTC = getUTCDate(start);
    var endUTC = getUTCDate(end);
    var stepMs = step.as('milliseconds');
    var dates = [];
    while(startUTC < endUTC) {
      dates.push(new Date(startUTC).toISOString());
      startUTC += stepMs;
    }
    return dates;
  };

  gn.AppWmstService['$inject'] = [
    '$timeout'
  ];

  module.service('wmstService', gn.AppWmstService);


  function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

      canvas.getContext('2d').drawImage(this, 0, 0);

      // ... or get as Data URI
      callback(canvas.toDataURL('image/png'));
    };
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  }

})();

