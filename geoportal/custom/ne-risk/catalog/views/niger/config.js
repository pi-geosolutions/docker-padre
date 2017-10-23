(function() {

  goog.provide('gn_search_niger_config');
  var module = angular.module('gn_search_niger_config', []);

  module
      .run([
        'gnViewerSettings',
        function(viewerSettings) {

          viewerSettings.ui = {
            name: 'niger',
            title: '',
            map: {
              center: [927028.2790426177, 1920098.1505236274],
              zoom: 6,
              extent: [-639625.0526903549, 891561.4979182958, 2493681.61077559, 2948634.803128959]
            },
            auService: 'http://ne-risk.pigeosolutions.fr/sigdt-config/services/',
            geonamesCode: 'NE'
          }
        }]);
})();
