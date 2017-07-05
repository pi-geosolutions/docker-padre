(function() {

  goog.provide('gn_search_mali_config');
  var module = angular.module('gn_search_mali_config', []);

  module
      .run([
        'gnViewerSettings',
        function(viewerSettings) {

          viewerSettings.ui = {
            name: 'mali',
            title: '',
            map: {
              center: [-500000, 2000000],
              zoom: 6,
              extent: [-2000000,600000,1000000,3500000]
            },
            auService: 'https://ml-risk.pigeosolutions.fr/sigdt-config/services-mali/',
            geonamesCode: 'ML'
          }
        }]);
})();
