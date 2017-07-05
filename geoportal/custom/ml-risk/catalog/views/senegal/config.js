(function() {

  goog.provide('gn_search_senegal_config');
  var module = angular.module('gn_search_senegal_config', []);

  module
      .run([
        'gnViewerSettings',
        function(viewerSettings) {

          viewerSettings.ui = {
            name: 'senegal',
            title: '',
            map: {
              center: [-1609458.0675726712, 1583163.7298425706],
              zoom: 7,
              extent: [-2153078.2127368446, 1041378.0733572412,
                -1073175.8771238746, 2135956.318400965]
            },
            auService: 'http://sn-risk.pigeo.fr/sigdt-config/services-senegal/',
            geonamesCode: 'SN'
          }
        }]);
})();