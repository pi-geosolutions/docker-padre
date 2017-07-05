(function() {

  goog.provide('app.linksbtn');

  var module = angular.module('app.linksbtn', []);


  module.directive('appLinksBtn', [
    function() {
      return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: '../../catalog/views/pigeo/js/geocatalog/linksbtn.html'
      };
    }
  ]);
  module.directive('appAdminBtn', [
    function() {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: '../../catalog/views/pigeo/js/geocatalog/adminbtn.html',
        link: function(scope) {
          scope.user = scope.ctrl.user;
        }
      };
    }
  ]);

  module.directive('appFixMdlinks', [ 'appGridService',
    function(appGridService) {

      return {
        restrict: 'A',
        scope: false,
        link: function(scope) {
          appGridService.feedMd(scope);
          scope.getScope = function() {
            return scope;
          }
        }
      };
    }]);

  module.service('appGridService', [ function() {

    this.feedMd = function(scope) {
      var md = scope.md;

      if(angular.isArray(md.type)) {
        if(md.type.indexOf('dataset')>=0) {
          md.icon = {cls: 'fa-database', title: 'dataset'}
        }
        else if(md.type.indexOf('series')>=0) {
          md.icon = {cls: 'fa-database', title: 'series'}
        }
        else if(md.type.indexOf('software')>=0) {
          md.icon = {cls: 'fa-hdd-o', title: 'software'}
        }
        else if(md.type.indexOf('map')>=0) {
          md.icon = {cls: 'fa-globe', title: 'map'}
        }
        else if(md.type.indexOf('application')>=0) {
          md.icon = {cls: 'fa-hdd-o', title: 'application'}
        }
        else if(md.type.indexOf('basicgeodata')>=0) {
          md.icon = {cls: 'fa-globe', title: 'basicgeodata'}
        }
        else if(md.type.indexOf('service')>=0) {
          md.icon = {cls: 'fa-globe', title: 'service'}
        }
      }

      var thumbs = md.getThumbnails();
      md.thumbnail = thumbs && (thumbs.small || thumbs.big || (
              thumbs.list.length && thumbs.list[0].url
          ));
      if(md.thumbnail && md.thumbnail.indexOf('http') <0 &&
          md.thumbnail.indexOf('resources.get') <0 ) {
        md.thumbnail = 'resources.get?fname=' + md.thumbnail +
            '&access=public&id=' + md.getId();
      }


      scope.links = md.getLinksByType('LINK');
      scope.downloads = [];
      scope.layers = [];

      angular.forEach(md.linksTree, function(transferOptions, i) {

        // get all layers and downloads for this transferOptions
        var layers = md.getLinksByType(i+1, '#OGC:WMTS',
            '#OGC:WMS', '#OGC:WMS-1.1.1-http-get-map',
            '#OGC:WMS-1.3.0-http-get-map', '#OGC:OWS-C');
        var downloads = md.getLinksByType(i+1, '#FILE', '#DB', '#COPYFILE',
            '#WWW:DOWNLOAD-1.0-link--download',
            '#WWW:DOWNLOAD-1.0-http--download', '#WFS', 'WCS');

        if(downloads.length > 0) {
          // If only one layer, we get only one download (we bind them later)
          // We take the first one cause there is a priority on the types
          if(layers.length == 1) {
            scope.downloads.push(downloads[0]);
          }
          else {
            scope.downloads = scope.downloads.concat(downloads);
          }
        }
        scope.layers = scope.layers.concat(layers);
      });
    }
  }]);

  module.factory('appResultviewFns', ['gnMap',
    function(gnMap) {
      return {
        addMdLayerToMap: function(link, md) {

          //hack but badly done in GN so hard to fix
          var map = angular.element($('#main-container')).scope().mainCtrl.map;
          var url, name;
          var i = link.url.indexOf('layers=');
          if(i >= 0) {
            var res = new RegExp(/layers=(.*)/g).exec(link.url);
            if (angular.isArray(res) && res.length == 2) {
              name = res[1];
              url = link.url.substring(0, i);
            }
          }
          gnMap.addWmsFromScratch(map,
              url || link.url, name || link.name, undefined, md).then(
              function(layer) {
                if(layer) {
                  layer.set('label', link.name);
                  gnMap.feedLayerWithRelated(layer, link.group);
                }
              }, function(error) {
                var layer = error.layer;
                if(layer) {
                  layer.set('label', link.name);
                }
              });
        },
        addAllMdLayersToMap: function (layers, md) {
          angular.forEach(layers, function (layer) {
            this.addMdLayerToMap(layer, md);
          }.bind(this));
        }
      };
    }
  ]);

  // fix angularjs bug fixed in v1.5.0-beta.1 : some html special char are
  // interpreted: &param => %B6m
  module.directive('appFixLinks', [ '$filter', '$sce',
    function($filter, $sce) {
      var icon = '<span class="fa-stack fa-lg">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-link fa-stack-1x fa-inverse"></i>' +
          '</span>';
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          scope.text = scope.result.get(scope.attr) || '';
          if (scope.text.indexOf('http') < 0) {
            return;
          }
          var link = $filter('linky')(scope.text);
          link = link.replace(/>(.)*</,' target="_blank">' + icon + '<')
          scope.text = $sce.trustAsHtml(link.replace(/&#182;/, '&para'));
        }
      }
    }
  ]);

})();
