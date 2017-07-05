(function() {

  goog.provide('app.formatter');

  var module = angular.module('app.formatter', []);

  gn.formatterDirective = function() {
    return {
      restrict: 'A',
      scope: {
        md: '=appFormatterMd'
      },
      controller: 'AppFormatterController',
      controllerAs: 'ctrl',
      bindToController: true

    };
  };
  module.directive('appFormatter', gn.formatterDirective);


  gn.formatterController = function($element, $scope, $rootScope, $http, $compile, $sce,
                                    gnPopup, appGridService, appResultviewFns, gnMdFormatter) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$compile = $compile;
    this.$sce = $sce;
    this.gnPopup = gnPopup;
    this.appGridService = appGridService;
    this.gnMdFormatter = gnMdFormatter;

    this.uuid = angular.isObject(this.md) ? this.md.getUuid() : this.md;
    this.url = '../api/records/{{uuid}}/formatters/pigeo_simple_view';

    $scope.resultviewFns = appResultviewFns;

    $element.on('click', function(e) {
      e.preventDefault();
      this.load();
      $scope.$apply();
    }.bind(this))
  };

  gn.formatterController.prototype.load = function() {
    this.$rootScope.$broadcast('mdLoadingStart');

    var newscope = this.$scope.$new();

    this.gnMdFormatter.getFormatterUrl(this.url,
      newscope, this.uuid).then(function(url) {
      this.$http.get(url).then(function (response) {
        this.$rootScope.$broadcast('mdLoadingEnd');
        var md = newscope.md;
        this.appGridService.feedMd(this.$scope);
        var mdHtml = this.$compile(angular.element(response.data))(this.$scope);

        var popup = this.gnPopup.create({
          title: md.title || md.defaultTitle,
          content: mdHtml.prop('outerHTML'),
          className: 'app-mdview'
        }, this.$scope);

        gnFormatter.formatterOnComplete();
        popup.element.on('click', function (e) {
          $('.app-mdview').css('z-index', '10000');
          popup.element.css('z-index', '10001');
        });

      }.bind(this), function () {
        this.$rootScope.$broadcast('mdLoadingEnd');
      }.bind(this));
    }.bind(this));
  };


  gn.formatterController['$inject'] = ['$element',
    '$scope', '$rootScope', '$http', '$compile', '$sce', 'gnPopup',
    'appGridService', 'appResultviewFns', 'gnMdFormatter'
  ];

  module.controller('AppFormatterController',
      gn.formatterController);

})();